import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { AtStrategy } from "./strategies/at.strategy";
import { RtStrategy } from "./strategies/rt.strategy";
import { DiscordStrategy } from "./strategies/discord.strategy";
import { DiscordAuthService } from "./discord-auth.service";
import { GithubStrategy } from "./strategies/github.strategy";
import { GithubAuthService } from "./github-auth.service";
import { EmailService } from "../utils/emails/email.service";
import { MailConfigModule } from "@/config/mail/mailConfig.module";
import { AppConfigModule } from "@/config/app/appConfig.module";
import { AuthConfigModule } from "@/config/auth/authConfig.module";
import { OAuthConfigModule } from "../config/Oauth/oauthConfig.module";
import { AuthConfig } from "@/config/auth/auth.interface";

@Module({
    imports: [
        AppConfigModule,
        AuthConfigModule,
        OAuthConfigModule,
        UsersModule,
        PassportModule,
        MailConfigModule,
        JwtModule.registerAsync({
            imports: [AuthConfigModule],
            useFactory: async (authConfig: AuthConfig) => ({
                secret: authConfig.secrets.JWT_SECRET,
            }),
            inject: ["Auth-Config"],
        }),
    ],
    providers: [
        EmailService,
        AuthService,
        LocalStrategy,
        AtStrategy,
        RtStrategy,
        DiscordStrategy,
        {
            provide: "DISCORD_OAUTH",
            useClass: DiscordAuthService,
        },
        GithubStrategy,
        {
            provide: "GITHUB_OAUTH",
            useClass: GithubAuthService,
        },
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
