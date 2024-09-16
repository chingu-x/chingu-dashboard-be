import { Injectable } from "@nestjs/common";
import { AbilityBuilder, PureAbility } from "@casl/ability";
import { PrismaSubjects } from "../prisma-generated-types";
import { createPrismaAbility, PrismaQuery } from "@casl/prisma";
import { UserReq } from "../../global/types/CustomRequest";
import { formTypeId } from "../../global/constants/formTypeId";

export enum Action {
    Manage = "manage",
    Create = "create",
    Read = "read",
    Update = "update",
    Delete = "delete",
    Submit = "submit",
    ManageSprintForms = "manageSprintForms",
}

type ExtendedSubjects = "all";
export type AppSubjects = PrismaSubjects | ExtendedSubjects;
export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

@Injectable()
export class AbilityFactory {
    defineAbility(user: UserReq) {
        const { can, build } = new AbilityBuilder<AppAbility>(
            createPrismaAbility,
        );

        const userVoyageTeamIds = user.voyageTeams.map((vt) => vt.teamId);
        const userVoyageTeamMemberIds = user.voyageTeams.map(
            (vt) => vt.memberId,
        );

        if (user.roles.includes("admin")) {
            can(Action.Manage, "all");
        } else if (user.roles.includes("voyager")) {
            can([Action.Submit], "Voyage");
            can([Action.Manage], "VoyageTeam", {
                id: { in: userVoyageTeamIds },
            });
            // For Ideation and Tech stack, we make the permission team based here
            // as there are times we'll need them to be able to manage other team members ideations/tech
            // more specific permission checks can be found in `ideations.ability.ts` etc
            can([Action.Manage], "Ideation", {
                voyageTeamMemberId: {
                    in: userVoyageTeamMemberIds,
                },
            });
            can([Action.Submit, Action.Read], "Form");
            can([Action.Manage], "TeamTechStackItem");
            can([Action.Manage], "Resource", {
                teamMemberId: {
                    in: userVoyageTeamMemberIds,
                },
            });
            can([Action.Manage], "Feature", {
                teamMemberId: {
                    in: userVoyageTeamMemberIds,
                },
            });
            can([Action.ManageSprintForms, Action.Read], "Sprint");
            can([Action.Manage], "SprintMeetingOrAgenda");
        } else {
            // all other users
            can([Action.Submit, Action.Read], "Form", {
                formTypeId: {
                    in: [formTypeId["user"]],
                },
            });
        }
        return build({
            detectSubjectType: (object) => object.__caslSubjectType__,
        });
    }
}
