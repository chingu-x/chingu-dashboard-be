import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-discord";
import { IAuthProvider } from "../../global/interfaces/oauth.interface";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, "discord") {
    constructor(
        @Inject("DISCORD_OAUTH")
        private readonly discordAuthService: IAuthProvider,
    ) {
        super({
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DISCORD_CALLBACK_URL,
            scope: ["identify", "email"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ): Promise<any> {
        const { username, id, avatar, email } = profile;

        return this.discordAuthService.validateUser({
            discordId: id,
            username,
            avatar,
            email,
        });
    }
}
