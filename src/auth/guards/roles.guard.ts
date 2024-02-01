import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AppRoles } from "../auth.roles";
import { ROLES_KEY } from "../../global/decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<AppRoles[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        const canAccess = requiredRoles.some(
            (role) => user.roles?.includes(role),
        );
        if (!canAccess) {
            throw new ForbiddenException(
                `Forbidden Access: Required permission ${requiredRoles}`,
            );
        }
        return canAccess;
    }
}
