import {
    Action,
    AppSubjects,
} from "../../ability/ability.factory/ability.factory";
import { SetMetadata } from "@nestjs/common";

export interface RequiredRule {
    action: Action;
    subject: AppSubjects;
}

export const CHECK_ABILITY = "check_ability";

export const CheckAbilities = (...requirements: RequiredRule[]) =>
    SetMetadata(CHECK_ABILITY, requirements);

/* === Reusable Rules for imports === */
export class ReadVoyageAbility implements RequiredRule {
    action = Action.Read;
    subject: "Voyage";
}
