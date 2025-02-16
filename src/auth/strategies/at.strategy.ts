import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable, Inject } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { AuthConfig } from "../../config/auth/auth.interface";
import { UserReq } from "@/global/types/CustomRequest";

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

    async validate(payload: any): Promise<UserReq | undefined> {
        //Get user roles
        const userRoles = await this.usersService.getUserRolesById(payload.sub);

        // Note: Update global/types/CustomRequest when updating this
        //Check if userRoles actually returns user details before returning
        if (userRoles) {
            return {
                userId: payload.sub,
                email: payload.email,
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
