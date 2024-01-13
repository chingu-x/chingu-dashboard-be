import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                RtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.RT_SECRET,
            passReqToCallback: true,
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

    async validate(req: Request, payload: any) {
        const refreshToken = req.cookies.refresh_token;
        return {
            userId: payload.sub,
            email: payload.email,
            refresh_token: refreshToken,
        };
    }
}
