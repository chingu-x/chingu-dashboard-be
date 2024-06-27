import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AbilityFactory } from "../../ability/ability.factory/ability.factory";
import {
    CHECK_ABILITY,
    RequiredRule,
} from "../../global/decorators/abilities.decorator";
import { ForbiddenError } from "@casl/ability";

@Injectable()
export class AbilitiesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: AbilityFactory,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride("isPublic", [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const isUnverified = this.reflector.getAllAndOverride("isUnverified", [
            context.getHandler(),
            context.getClass(),
        ]);

        const { user } = context.switchToHttp().getRequest();

        if (!isUnverified && user.isVerified === false) return false;

        const rules =
            this.reflector.getAllAndMerge<RequiredRule[]>(CHECK_ABILITY, [
                context.getHandler(),
                context.getClass(),
            ]) || [];

        const ability = this.caslAbilityFactory.defineAbility(user);

        rules.forEach((rule) =>
            ForbiddenError.from(ability).throwUnlessCan(
                rule.action,
                rule.subject,
            ),
        );

        return true;
    }
}
