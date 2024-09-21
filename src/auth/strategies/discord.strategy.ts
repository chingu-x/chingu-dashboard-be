import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-discord";
import { IAuthProvider } from "../../global/interfaces/oauth.interface";
import { OAuthConfig } from "../../config/Oauth/oauthConfig.interface";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, "discord") {
    constructor(
        @Inject("DISCORD_OAUTH")
        private readonly discordAuthService: IAuthProvider,
        @Inject("OAuth-Config") private oAuthConfig: OAuthConfig,
    ) {
        const { clientId, clientSecret, callbackUrl } = oAuthConfig.discord;
        super({
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: callbackUrl,
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
