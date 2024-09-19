import { BadRequestException } from "@nestjs/common";
import { VoyageTeamMemberWithSprintIds } from "src/global/types/voyage.types";
import { ValidateOrGetDbItemGlobalFunc } from "src/global/types/global.types";

// find voyage that team member is part of and make sure it matches the input sprint id's voyage
export const canSubmitCheckin = async (
    sprintId: number,
    voyageTeamMemberId: number,
    validateOrGetDbItem: ValidateOrGetDbItemGlobalFunc,
) => {
    // find voyageNumber team member is part of and make sure it matches input
    const teamMemberData: VoyageTeamMemberWithSprintIds | null =
        await validateOrGetDbItem<VoyageTeamMemberWithSprintIds>(
            "voyageTeamMember",
            voyageTeamMemberId,
            "id",
            "findUnique",
            undefined,
            {
                select: {
                    voyageTeam: {
                        select: {
                            voyage: {
                                select: {
                                    sprints: { select: { id: true } },
                                },
                            },
                        },
                    },
                },
            },
        );

    if (
        !teamMemberData?.voyageTeam.voyage.sprints.some(
            (sprint) => sprint.id === sprintId,
        )
    ) {
        throw new BadRequestException(
            `Voyage team member id ${voyageTeamMemberId} is not part of the same voyage as sprint id ${sprintId}.`,
        );
    }
};
