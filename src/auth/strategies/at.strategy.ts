import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { AuthConfigService } from "src/config/auth/authConfig.service";
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt-at") {
    constructor(
        private usersService: UsersService,
        private authConfigService: AuthConfigService,
    ) {
        const secrets = authConfigService.getSecrets();
        if (!secrets) {
            throw new Error("Auth secrets not found in configuration");
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                AtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: secrets.at,
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
        return null;
    }

    async validate(payload: any) {
        const userInDb = await this.usersService.getUserRolesById(payload.sub);

        // Note: Update global/types/CustomRequest when updating this
        return {
            userId: payload.sub,
            email: payload.email,
            roles: userInDb.roles,
            isVerified: userInDb.emailVerified,
            voyageTeams: userInDb.voyageTeamMembers?.map((t) => {
                return {
                    teamId: t.voyageTeamId,
                    memberId: t.id,
                };
            }),
        };
    }
}
