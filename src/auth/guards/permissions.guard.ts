import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
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
            const canAccess = user.voyageTeams?.includes(
                parseInt(params?.teamId),
            );

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
