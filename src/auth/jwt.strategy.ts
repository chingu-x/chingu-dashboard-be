import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    private static extractJWT(req: Request): string | null {
        if (
            req.cookies &&
            "access_token" in req.cookies &&
            req.cookies.access_token.length > 0
        ) {
            return req.cookies.access_token;
        }
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}
