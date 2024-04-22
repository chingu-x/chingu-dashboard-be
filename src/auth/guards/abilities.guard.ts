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
        const rules =
            this.reflector.get<RequiredRule[]>(
                CHECK_ABILITY,
                context.getHandler(),
            ) || [];

        const req = context.switchToHttp().getRequest();
        const ability = this.caslAbilityFactory.defineAbility(req);

        rules.forEach((rule) =>
            ForbiddenError.from(ability).throwUnlessCan(
                rule.action,
                rule.subject,
            ),
        );
        return true;
    }
}
