import { UserReq } from "../../global/types/CustomRequest";
import prisma from "../../prisma/client";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

export const manageOwnResourceById = async (
    user: UserReq,
    resourceId: number,
) => {
    if (user.roles?.includes("admin")) return;
    const resource = await prisma.teamResource.findUnique({
        where: {
            id: resourceId,
        },
    });
    if (!resource) {
        throw new NotFoundException(`Resource (id:${resourceId}) not found`);
    }

    if (
        !user.voyageTeams
            .map((vt) => vt.memberId)
            .includes(resource.teamMemberId!)
    ) {
        throw new ForbiddenException(
            "Resource access control: You can only manage your own resources.",
        );
    }
};
