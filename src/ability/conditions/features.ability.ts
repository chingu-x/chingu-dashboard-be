import { UserReq } from "../../global/types/CustomRequest";
import prisma from "../../prisma/client";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

export const manageOwnFeaturesById = async (
    user: UserReq,
    featureId: number,
) => {
    if (user.roles?.includes("admin")) return;
    const feature = await prisma.projectFeature.findUnique({
        where: {
            id: featureId,
        },
        select: {
            teamMemberId: true,
        },
    });
    if (!feature) {
        throw new NotFoundException(
            `Project Feature (id:${featureId}) not found`,
        );
    }

    if (
        !user.voyageTeams
            .map((vt) => vt.memberId)
            .includes(feature.teamMemberId!)
    ) {
        throw new ForbiddenException(
            "Features access control: You can only manage your own project features.",
        );
    }
};
