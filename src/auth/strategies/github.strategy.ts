import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-github2";
import { IAuthProvider } from "../../global/interfaces/oauth.interface";
import { OAuthConfig } from "../../config/Oauth/oauthConfig.interface";
import { InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    constructor(
        @Inject("GITHUB_OAUTH")
        private readonly githubAuthService: IAuthProvider,
        @Inject("OAuth-Config") private oAuthConfig: OAuthConfig,
    ) {
        const { clientId, clientSecret, callbackUrl } = oAuthConfig.github;
        super({
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: callbackUrl,
            scope: ["identify", "user:email"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ): Promise<any> {
        const { username, id, photos, emails } = profile;

        const avatar = photos && photos.length > 0 ? photos[0].value : null;
        const email = emails && emails.length > 0 ? emails[0].value : null;

        if (!email) {
            throw new InternalServerErrorException(
                "[github-auth.service]: Cannot get email from GitHub.",
            );
        }

        return this.githubAuthService.validateUser({
            githubId: id,
            username: username ? username : "",
            avatar,
            email,
        });
    }
}
