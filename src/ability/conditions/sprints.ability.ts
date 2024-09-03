import { UserReq } from "../../global/types/CustomRequest";
import { BadRequestException } from "@nestjs/common";

type VoyageTeamMemberWithSprintIds = {
    voyageTeam: {
        voyage: {
            sprints: {
                id: number;
            }[];
        };
    };
};

type ValidateOrGetDbItemGlobalFunc = <T>(
    dbTableName: string,
    searchValue: string | number | [number, string] | null | [string, string],
    searchField?: string,
    findOptions?: string,
    whereOptions?: Record<string, any>,
    queryOptions?: Record<string, any>,
    customErrorMessage?: () => never,
) => Promise<T | null>;

// find voyageNumber team member is part of and make sure it matches input
export const canSubmitCheckin = async (
    user: UserReq,
    sprintId: number,
    voyageTeamMemberId: number,
    validateOrGetDbItem: ValidateOrGetDbItemGlobalFunc,
) => {
    if (user.roles?.includes("admin")) return;

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
