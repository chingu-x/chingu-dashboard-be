import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { AtStrategy } from "./strategies/at.strategy";
import { RtStrategy } from "./strategies/rt.strategy";

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            // secret: process.env.JWT_SECRET,
            // signOptions: { expiresIn: "7 days" },
        }),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        AtStrategy,
        RtStrategy,
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
