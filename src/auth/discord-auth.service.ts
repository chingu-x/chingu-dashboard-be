import {
    Injectable,
    Inject,
    InternalServerErrorException,
} from "@nestjs/common";
import { IAuthProvider } from "../global/interfaces/oauth.interface";
import { PrismaService } from "../prisma/prisma.service";
import { DiscordUser } from "../global/types/auth.types";
import { generatePasswordHash } from "../global/auth/auth";

import { OAuthConfig } from "@/config/Oauth/oauthConfig.interface";
@Injectable()
export class DiscordAuthService implements IAuthProvider {
    constructor(
        private prisma: PrismaService,
        @Inject("OAuth-Config") private oAuthConfig: OAuthConfig,
    ) {}
    async validateUser(user: DiscordUser) {
        const userInDb = await this.prisma.findUserByOAuthId(
            "discord",
            user.discordId,
        );

        if (userInDb)
            return {
                id: userInDb.userId,
                email: user.email,
            };
        return this.createUser(user);
    }

    async createUser(user: DiscordUser) {
        // generate a random password and not tell them so they can't login, but they will be able to reset password,
        // and will be able to login with this in future,
        // or maybe the app will prompt user the input the password, exact oauth flow is to be determined

        // this should not happen when "email" is in the scope
        if (!user.email)
            throw new InternalServerErrorException(
                "[discord-auth.service]: Cannot get email from discord to create a new Chingu account",
            );

        // check if email is in the database, add oauth profile to existing account, otherwise, create a new user account
        return this.prisma.user.upsert({
            where: {
                email: user.email,
            },
            update: {
                emailVerified: true,
                oAuthProfiles: {
                    create: {
                        provider: {
                            connect: {
                                name: "discord",
                            },
                        },
                        providerUserId: user.discordId,
                        providerUsername: user.username,
                    },
                },
            },
            create: {
                email: user.email,
                password: await generatePasswordHash(),
                emailVerified: true,
                avatar: `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`,
                oAuthProfiles: {
                    create: {
                        provider: {
                            connect: {
                                name: "discord",
                            },
                        },
                        providerUserId: user.discordId,
                        providerUsername: user.username,
                    },
                },
            },
        });
    }
}
