import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";
import { AuthConfigService } from "src/config/auth/authConfig.service";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(private authConfigService: AuthConfigService) {
        const secrets = authConfigService.getSecrets();
        if (!secrets) {
            throw new Error("Auth secrets not found in configuration");
        }
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                RtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: secrets.rt,
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
