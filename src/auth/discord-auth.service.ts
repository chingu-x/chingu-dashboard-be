import { Injectable } from "@nestjs/common";
import { IAuthProvider } from "../global/interfaces/oauth.interface";
import { PrismaService } from "../prisma/prisma.service";
import { DiscordUser } from "../global/types/auth.types";

@Injectable()
export class DiscordAuthService implements IAuthProvider {
    constructor(private prisma: PrismaService) {}
    async validateUser(user: DiscordUser) {
        const userInDb = await this.prisma.userOAuthProfile.findUserByOAuthId(
            "discord",
            user.discordId,
        );
        console.log(`discord-auth.service.ts (14): userInDb = ${userInDb}`);
    }

    createUser() {}

    findUserById() {}
}
