import { UserReq } from "../../global/types/CustomRequest";
import prisma from "../../prisma/client";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

// Note: Use methods in `voyage-teams.ability.ts` to check for team ideation management

// Check if the user "owns" this ideation
export const manageOwnIdeationById = async (
    user: UserReq,
    ideationId: number,
) => {
    if (user.roles?.includes("admin")) return;
    const ideation = await prisma.projectIdea.findUnique({
        where: {
            id: ideationId,
        },
    });
    if (!ideation) {
        throw new NotFoundException(`Ideation (id:${ideationId}) not found`);
    }
    // ideation is not linked to any members, this should never happen unless the user gets deleted
    // or removed from the team?
    // in this case we should let the rest of the team manage it
    if (!ideation.voyageTeamMemberId) {
        throw new ForbiddenException(
            `Ideation access control: You do not have sufficient permission to access this resource.`,
        );
    }
    if (
        !user.voyageTeams
            .map((vt) => vt.memberId)
            .includes(ideation.voyageTeamMemberId)
    ) {
        throw new ForbiddenException(
            "Ideation access control: You can only manage your own ideations.",
        );
    }
};
