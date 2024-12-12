import { UserReq } from "../../global/types/CustomRequest";
import { Action } from "../ability.factory/ability.factory";
import { ForbiddenError } from "@casl/ability";
import { VoyageTeam } from "@prisma/client";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { abilityFactory } from "./shared.ability";
import prisma from "../../prisma/client";

export const manageOwnVoyageTeamWithIdParam = (
    user: UserReq,
    teamIdParam: number,
) => {
    if (user.roles?.includes("admin")) return;
    if (!user.voyageTeams.map((vt) => vt.teamId).includes(teamIdParam)) {
        throw new ForbiddenException(
            "VoyageTeam access control: You can only access data for your own voyage team.",
        );
    }
};

export const userCanChangeCategory = async (
    categoryId: number,
    user: UserReq,
    teamId: number | undefined = undefined,
) => {
    if (user.roles?.includes("admin")) return;

    let match;
    try {
        match = await prisma.techStackCategory.findUnique({
            where: {
                id: categoryId,
            },
        });
    } catch {
        throw new NotFoundException(`Category ${categoryId} not found`);
    }

    if (teamId && match) {
        if (teamId != match.voyageTeamId) {
            throw new ForbiddenException(
                `Team ${teamId} cannot change category ${categoryId}`,
            );
        }
    }

    let permission = false;
    for (const team of user.voyageTeams) {
        if (team.teamId === match?.voyageTeamId) permission = true;
    }

    if (!permission) {
        throw new ForbiddenException(
            `This user cannot change category ${categoryId}`,
        );
    }
};
/***
 For future reference, this works, but it has to be of voyageTeamType *** without a special select statement ***
 So it should be used for cases when a team Id is not supplied (this would be an extra database query in most cases)
 but for cases when teamId is supplied as a parameter or in the req body, we can use that instead as there would
 less database query

 edit 1: non basic select type seems to work for the forms endpoint, please check this
 ***/
export const manageOwnVoyageTeam = (user: UserReq, voyageTeam: VoyageTeam) => {
    // mockUser for testing only, normally we would get this from user
    const mockUser = {
        voyageTeams: [{ teamId: 2, memberId: 1 }],
        userId: "userId",
        email: "email",
        isVerified: true,
        roles: ["voyager"],
    };
    const ability = abilityFactory.defineAbility(mockUser);

    ForbiddenError.from(ability).throwUnlessCan(Action.Read, {
        ...voyageTeam,
        __caslSubjectType__: "VoyageTeam",
    });
};
