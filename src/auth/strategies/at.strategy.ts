import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable, Inject } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { AuthConfig } from "../../config/auth/auth.interface";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt-at") {
    constructor(
        private usersService: UsersService,
        @Inject("Auth-Config") private authConfig: AuthConfig,
    ) {
        const { AT_SECRET } = authConfig.secrets;
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                AtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: AT_SECRET,
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
        //Check if user id provided in payload exists in db
        const userInDb = await this.usersService.findUserById(payload.sub);

        //Get user roles if userInDb exists & return
        if (userInDb) {
            const userRoles = await this.usersService.getUserRolesById(
                payload.sub,
            );

            // Note: Update global/types/CustomRequest when updating this
            return {
                userId: userInDb.id,
                email: userInDb.email,
                roles: userRoles.roles,
                isVerified: userRoles.emailVerified,
                voyageTeams: userRoles.voyageTeamMembers?.map((t) => {
                    return {
                        teamId: t.voyageTeamId,
                        memberId: t.id,
                    };
                }),
            };
        }
    }
}
