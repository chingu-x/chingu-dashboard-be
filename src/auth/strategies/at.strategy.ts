import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/users.service";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt-at") {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                AtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.AT_SECRET,
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
        const userInDb = await this.usersService.getUserRolesById(payload.sub);

        // Note: Update global/types/CustomRequest when updating this
        return {
            userId: payload.sub,
            email: payload.email,
            roles: userInDb.roles,
            voyageTeams: userInDb.voyageTeamMembers.map((t) => {
                return {
                    teamId: t.voyageTeamId,
                    memberId: t.id,
                };
            }),
        };
    }
}
