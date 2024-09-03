import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-discord";
import { IAuthProvider } from "../../global/interfaces/oauth.interface";
import { OAuthConfig } from "../../config/0auth/oauthConfig.interface";

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
            scope: ["identify"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ): Promise<any> {
        const { username, id, avatar, email } = profile;
        console.log(`discord.strategy.ts (22): accessToken = ${accessToken}`);
        console.log(`discord.strategy.ts (23): refreshToken = ${refreshToken}`);
        console.log(
            `discord.strategy.ts (24): profile = ${JSON.stringify(profile)})}`,
        );
        console.log(
            `discord.strategy.ts (24): profile = ${username}, ${id}, ${avatar}, ${email})}`,
        );

        await this.discordAuthService.validateUser({
            discordId: id,
            username,
            avatar,
        });
    }
}
