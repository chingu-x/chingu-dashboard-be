import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AppPermissions } from "../auth.permissions";
import { PERM_KEY } from "../../global/decorators/permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<
            AppPermissions[]
        >(PERM_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions) {
            return true;
        }
        const { user, params } = context.switchToHttp().getRequest();

        if (requiredPermissions.includes(AppPermissions.OWN_TEAM)) {
            // Admin can bypass this
            // if (user.roles.includes(AppRoles.Admin)) return true;
            if (!params.teamId) {
                throw new InternalServerErrorException(
                    "This permission guard requires :teamId param",
                );
            }

            const canAccess = user.voyageTeams
                ?.map((t) => t.teamId)
                ?.includes(parseInt(params?.teamId));

            if (!canAccess) {
                throw new ForbiddenException(
                    `Forbidden Access: Required permission ${requiredPermissions}`,
                );
            }
            return canAccess;
        } else {
            // no match App Permissions
            return true;
        }
    }
}
