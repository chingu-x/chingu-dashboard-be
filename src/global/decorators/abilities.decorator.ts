import { Action } from "../../ability/ability.factory/ability.factory";
import { PrismaSubjects } from "../../ability/prisma-generated-types";
import { SetMetadata } from "@nestjs/common";

export interface RequiredRule {
    action: Action;
    subject: PrismaSubjects;
}

export const CHECK_ABILITY = "check_ability";

export const CheckAbilities = (...requirements: RequiredRule[]) =>
    SetMetadata(CHECK_ABILITY, requirements);

/* === Reusable Rules for imports === */
export class ReadVoyageAbility implements RequiredRule {
    action = Action.Read;
    subject: "Voyage";
}
