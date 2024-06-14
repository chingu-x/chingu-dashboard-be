import { UserReq } from "../../global/types/CustomRequest";
import { abilityFactory } from "./shared.ability";
import { Form } from "@prisma/client";
import { ForbiddenError } from "@casl/ability";
import { Action } from "../ability.factory/ability.factory";

// for read and submit - if they can read, they should be able to submit, so we can use the same check
export const canReadAndSubmitForms = (user: UserReq, form: Form) => {
    const ability = abilityFactory.defineAbility(user);

    ForbiddenError.from(ability)
        .setMessage("Cannot read or submit")
        .throwUnlessCan(Action.Submit, {
            ...form,
            __caslSubjectType__: "Form",
        });
};
