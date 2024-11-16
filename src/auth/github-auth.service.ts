import {
    Injectable,
    Inject,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import {
    AuthUserResult,
    IAuthProvider,
} from "../global/interfaces/oauth.interface";
import { PrismaService } from "../prisma/prisma.service";
import { GithubUser } from "../global/types/auth.types";
import { generatePasswordHash } from "../global/auth/utils";
import { OAuthConfig } from "@/config/Oauth/oauthConfig.interface";

@Injectable()
export class GithubAuthService implements IAuthProvider {
    constructor(
        private prisma: PrismaService,
        @Inject("OAuth-Config") private oAuthConfig: OAuthConfig,
    ) {}
    async validateUser(user: GithubUser) {
        const userInDb = await this.prisma.findUserByOAuthId(
            "github",
            user.githubId,
        );

        if (userInDb)
            return {
                id: userInDb.userId,
                email: user.email,
            };
        return this.createUser(user);
    }

    async createUser(user: GithubUser): Promise<AuthUserResult> {
        // generate a random password and not tell them so they can't login, but they will be able to reset password,
        // and will be able to login with this in future,
        // or maybe the app will prompt user the input the password, exact oauth flow is to be determined

        // this should not happen when "user:email" is in the scope
        if (!user.email)
            throw new InternalServerErrorException(
                "[github-auth.service]: Cannot get email from github to create a new Chingu account",
            );

        // check if email is in the database, add oauth profile to existing account, otherwise, create a new user account
        let upsertResult;
        try {
            upsertResult = await this.prisma.user.upsert({
                where: {
                    email: user.email,
                },
                update: {
                    emailVerified: true,
                    oAuthProfiles: {
                        create: {
                            provider: {
                                connect: {
                                    name: "github",
                                },
                            },
                            providerUserId: user.githubId,
                            providerUsername: user.username,
                        },
                    },
                },
                create: {
                    email: user.email,
                    password: await generatePasswordHash(),
                    emailVerified: true,
                    avatar: user.avatar,
                    oAuthProfiles: {
                        create: {
                            provider: {
                                connect: {
                                    name: "github",
                                },
                            },
                            providerUserId: user.githubId,
                            providerUsername: user.username,
                        },
                    },
                },
            });
        } catch (e) {
            if (e.code === "P2025") {
                if (e.message.includes("OAuthProvider")) {
                    throw new NotFoundException(
                        "OAuth provider not found in the database",
                    );
                }
                console.error("Unexpected error during upsert:", e);
                throw e;
            }
        }
        return upsertResult;
    }
}
