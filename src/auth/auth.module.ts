import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { AtStrategy } from "./strategies/at.strategy";
import { RtStrategy } from "./strategies/rt.strategy";
import * as process from "process";
import { DiscordStrategy } from "./strategies/discord.strategy";
import { DiscordAuthService } from "./discord-auth.service";

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        AtStrategy,
        RtStrategy,
        DiscordStrategy,
        {
            provide: "DISCORD_OAUTH",
            useClass: DiscordAuthService,
        },
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
