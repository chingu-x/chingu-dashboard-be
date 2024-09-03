import { Injectable, Inject } from "@nestjs/common";
import { IAuthProvider } from "../global/interfaces/oauth.interface";
import { PrismaService } from "../prisma/prisma.service";
import { DiscordUser } from "../global/types/auth.types";
import { OAuthConfig } from "src/config/0auth/oauthConfig.interface";
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
        console.log(
            `discord-auth.service.ts (14): userInDb = ${JSON.stringify(userInDb)}`,
        );
    }

    createUser() {}

    findUserById() {}
}
