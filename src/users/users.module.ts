import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { JwtStrategy } from "../auth/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: "7 days" },
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, JwtStrategy],
    exports: [UsersService],
})
export class UsersModule {}
