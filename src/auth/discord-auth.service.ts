import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { IAuthProvider } from "../global/interfaces/oauth.interface";
import { PrismaService } from "../prisma/prisma.service";
import { DiscordUser } from "../global/types/auth.types";
import { generatePasswordHash } from "../utils/auth";
import { AuthService } from "./auth.service";

@Injectable()
export class DiscordAuthService implements IAuthProvider {
    constructor(
        private prisma: PrismaService,
        private authService: AuthService,
    ) {}

    async validateUser(user: DiscordUser) {
        const userInDb = await this.prisma.findUserByOAuthId(
            "discord",
            user.discordId,
        );
        console.log(
            `discord-auth.service.ts (14): userInDb = ${JSON.stringify(userInDb)}`,
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

        return this.prisma.user.create({
            data: {
                email: user.email,
                password: await generatePasswordHash(),
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
        });
    }
}
