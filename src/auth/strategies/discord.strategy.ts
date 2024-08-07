import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-discord";
import { Profile } from "passport-discord";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, "discord") {
    constructor() {
        super({
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DISCORD_CALLBACK_URL,
            scope: ["identify", "guilds"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ): Promise<any> {
        const { username, id, avatar } = profile;
        console.log(`discord.strategy.ts (22): accessToken = ${accessToken}`);
        console.log(`discord.strategy.ts (23): refreshToken = ${refreshToken}`);
        console.log(
            `discord.strategy.ts (24): profile = ${username}, ${id}, ${avatar})}`,
        );
    }
}
