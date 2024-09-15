import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable, Inject } from "@nestjs/common";
import { AuthConfig } from "../../config/auth/auth.interface";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(@Inject("Auth-Config") private authConfig: AuthConfig) {
        const { RT_SECRET } = authConfig.secrets;

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                RtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: RT_SECRET,
            passReqToCallback: true,
        });
    }

    private static extractJWT(req: Request): string | null {
        if (
            req.cookies &&
            "refresh_token" in req.cookies &&
            req.cookies.refresh_token.length > 0
        ) {
            return req.cookies.refresh_token;
        }
        return null;
    }

    async validate(req: Request, payload: any) {
        return {
            userId: payload.sub,
            email: payload.email,
            refreshToken: req.cookies.refresh_token,
        };
    }
}
