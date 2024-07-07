import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTeamTechDto } from "./dto/create-tech.dto";
import { UpdateTechSelectionsDto } from "./dto/update-tech-selections.dto";
import { UpdateTeamTechDto } from "./dto/update-tech.dto";
import { CustomRequest } from "../global/types/CustomRequest";
import { manageOwnVoyageTeamWithIdParam } from "../ability/conditions/voyage-teams.ability";

const MAX_SELECTION_COUNT = 3;

@Injectable()
export class TechsService {
    constructor(private prisma: PrismaService) {}

    validateTeamId = async (teamId: number) => {
        const voyageTeam = await this.prisma.voyageTeam.findUnique({
            where: {
                id: teamId,
            },
        });

        if (!voyageTeam) {
            throw new NotFoundException(`Team (id: ${teamId}) doesn't exist.`);
        }
    };

    getAllTechItemsByTeamId = async (teamId: number, req: CustomRequest) => {
        await this.validateTeamId(teamId);

        manageOwnVoyageTeamWithIdParam(req.user, teamId);
        return this.prisma.techStackCategory.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                teamTechStackItems: {
                    where: {
                        voyageTeamId: teamId,
                    },
                    select: {
                        id: true,
                        name: true,
                        isSelected: true,
                        teamTechStackItemVotes: {
                            select: {
                                votedBy: {
                                    select: {
                                        member: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true,
                                                avatar: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    };

    async updateTechStackSelections(
        req: CustomRequest,
        teamId: number,
        updateTechSelectionsDto: UpdateTechSelectionsDto,
    ) {
        //check for valid teamId
        await this.validateTeamId(teamId);

        //check if user is a member of the team
        manageOwnVoyageTeamWithIdParam(req.user, teamId);

        const categories = updateTechSelectionsDto.categories;

        //count selections in categories for exceeding MAX_SELECT_COUNT
        categories.forEach((category) => {
            const selectCount = category.techs.reduce(
                (acc: number, tech) => acc + (tech.isSelected ? 1 : 0),
                0,
            );
            if (selectCount > MAX_SELECTION_COUNT)
                throw new BadRequestException(
                    `Only ${MAX_SELECTION_COUNT} selections allowed per category`,
                );
        });

        //extract techs to an array for .map
        const techsArray: any[] = [];
        categories.forEach((category) => {
            category.techs.forEach((tech) => techsArray.push(tech));
        });
        return this.prisma.$transaction(
            techsArray.map((tech) => {
                return this.prisma.teamTechStackItem.update({
                    where: {
                        id: tech.techId,
                    },
                    data: {
                        isSelected: tech.isSelected,
                    },
                });
            }),
        );
    }

    async addNewTeamTech(
        req: CustomRequest,
        teamId: number,
        createTechVoteDto: CreateTeamTechDto,
    ) {
        //check for valid teamId
        await this.validateTeamId(teamId);

        manageOwnVoyageTeamWithIdParam(req.user, teamId);

        try {
            const newTeamTechItem = await this.prisma.teamTechStackItem.create({
                data: {
                    name: createTechVoteDto.techName,
                    categoryId: createTechVoteDto.techCategoryId,
                    voyageTeamId: teamId,
                    voyageTeamMemberId: createTechVoteDto.voyageTeamMemberId,
                },
            });

            const TeamTechItemFirstVote =
                await this.prisma.teamTechStackItemVote.create({
                    data: {
                        teamTechId: newTeamTechItem.id,
                        teamMemberId: createTechVoteDto.voyageTeamMemberId,
                    },
                });
            return {
                teamTechStackItemVoteId: TeamTechItemFirstVote.id,
                teamTechId: newTeamTechItem.id,
                teamMemberId: TeamTechItemFirstVote.teamMemberId,
                createdAt: TeamTechItemFirstVote.createdAt,
                updatedAt: TeamTechItemFirstVote.updatedAt,
            };
        } catch (e) {
            if (e.code === "P2002") {
                throw new ConflictException(
                    `${createTechVoteDto.techName} already exists in the available team tech stack.`,
                );
            }
            throw e;
        }
    }

    async updateExistingTeamTech(
        req: CustomRequest,
        updateTeamTechDto: UpdateTeamTechDto,
        teamTechItemId: number,
    ) {
        const { techName } = updateTeamTechDto;
        // check if team tech item exists
        const teamTechItem = await this.prisma.teamTechStackItem.findUnique({
            where: {
                id: teamTechItemId,
            },
            select: {
                voyageTeamId: true,
                teamTechStackItemVotes: {
                    select: {
                        votedBy: {
                            select: {
                                member: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!teamTechItem)
            throw new NotFoundException(
                `[Tech Service]: Team Tech Stack Item with id:${teamTechItemId} not found`,
            );

        manageOwnVoyageTeamWithIdParam(req.user, teamTechItem.voyageTeamId);

        // check if the tech stack item has votes other than the user created it
        if (teamTechItem.teamTechStackItemVotes.length > 1) {
            throw new ConflictException(
                `[Tech Service]: Tech Stack Item cannot be updated when others have voted for it.`,
            );
        }
        // The person having the last vote has the  ability to edit and delete the tech stack item
        if (
            req.user.userId !==
            teamTechItem.teamTechStackItemVotes[0].votedBy?.member.id
        ) {
            throw new ForbiddenException(
                "[Tech Service]:  You cannot update this Tech Stack Item.",
            );
        }

        try {
            const updateTechStackItem =
                await this.prisma.teamTechStackItem.update({
                    where: {
                        id: teamTechItemId,
                    },
                    data: {
                        name: updateTeamTechDto.techName,
                    },
                    select: {
                        id: true,
                        name: true,
                        voyageTeamMemberId: true,
                        voyageTeamId: true,
                        teamTechStackItemVotes: {
                            select: {
                                votedBy: {
                                    select: {
                                        member: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true,
                                                avatar: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });

            return updateTechStackItem;
        } catch (e) {
            if (e.code === "P2002") {
                throw new ConflictException(
                    `[Tech Service]: ${techName} already exists in the available team tech stack.`,
                );
            }
            throw e;
        }
    }

    async deleteTeamTech(req: CustomRequest, teamTechItemId: number) {
        try {
            // check if team tech item exists

            const teamTechItem = await this.prisma.teamTechStackItem.findUnique(
                {
                    where: {
                        id: teamTechItemId,
                    },
                    select: {
                        voyageTeamId: true,
                        teamTechStackItemVotes: {
                            select: {
                                votedBy: {
                                    select: {
                                        member: {
                                            select: {
                                                id: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            );

            if (!teamTechItem)
                throw new NotFoundException(
                    `[Tech Service]: Team Tech Stack Item with id:${teamTechItemId} not found`,
                );

            manageOwnVoyageTeamWithIdParam(req.user, teamTechItem.voyageTeamId);

            // check if the tech stack item has votes other than the user created it
            if (teamTechItem.teamTechStackItemVotes.length > 1) {
                throw new ConflictException(
                    `[Tech Service]: Tech Stack Item cannot be delete when others have voted for it.`,
                );
            }
            // The person having the last vote has the  ability to edit and delete the tech stack item
            if (
                req.user.userId !==
                teamTechItem.teamTechStackItemVotes[0].votedBy?.member.id
            ) {
                throw new ForbiddenException(
                    "[Tech Service]:  You cannot delete this Tech Stack Item.",
                );
            }

            await this.prisma.teamTechStackItem.delete({
                where: {
                    id: teamTechItemId,
                },
            });
            return {
                message: "The  tech stack item is deleted",
                statusCode: 200,
            };
        } catch (e) {
            throw e;
        }
    }

    async addExistingTechVote(req: CustomRequest, teamTechItemId: number) {
        // check if team tech item exists
        const teamTechItem = await this.prisma.teamTechStackItem.findUnique({
            where: {
                id: teamTechItemId,
            },
        });

        if (!teamTechItem)
            throw new NotFoundException("Team Tech Item not found");

        manageOwnVoyageTeamWithIdParam(req.user, teamTechItem.voyageTeamId);

        const voyageMemberId = req.user.voyageTeams.find(
            (vt) => vt.teamId === teamTechItem.voyageTeamId,
        )!.memberId;

        try {
            const teamMemberTechVote =
                await this.prisma.teamTechStackItemVote.create({
                    data: {
                        teamTechId: teamTechItemId,
                        teamMemberId: voyageMemberId,
                    },
                });
            // If successful, it returns an object containing the details of the vote
            return {
                teamTechStackItemVoteId: teamMemberTechVote.id,
                teamTechId: teamTechItemId,
                teamMemberId: teamMemberTechVote.teamMemberId,
                createdAt: teamMemberTechVote.createdAt,
                updatedAt: teamMemberTechVote.updatedAt,
            };
        } catch (e) {
            if (e.code === "P2002") {
                throw new ConflictException(
                    `User has already voted for techId:${teamTechItemId}`,
                );
            }
            throw e;
        }
    }

    async removeVote(req: CustomRequest, teamTechItemId: number) {
        // check if team tech item exists
        const teamTechItem = await this.prisma.teamTechStackItem.findUnique({
            where: {
                id: teamTechItemId,
            },
        });

        if (!teamTechItem)
            throw new NotFoundException("Team Tech Item not found");

        manageOwnVoyageTeamWithIdParam(req.user, teamTechItem.voyageTeamId);

        const voyageMemberId = req.user.voyageTeams.find(
            (vt) => vt.teamId === teamTechItem.voyageTeamId,
        )!.memberId;

        try {
            await this.prisma.teamTechStackItemVote.delete({
                where: {
                    userTeamStackVote: {
                        teamTechId: teamTechItemId,
                        teamMemberId: voyageMemberId,
                    },
                },
            });

            // check if it was the last vote, if so, also delete the team tech item entry
            const teamTechItem = await this.prisma.teamTechStackItem.findUnique(
                {
                    where: {
                        id: teamTechItemId,
                    },
                    select: {
                        teamTechStackItemVotes: true,
                    },
                },
            );
            if (!teamTechItem)
                throw new InternalServerErrorException(
                    `techs.service.ts: teamTechItem not found for teamTechItemId=${teamTechItemId}`,
                );
            // Check if the teamTechStackItemVotes array is empty
            if (teamTechItem.teamTechStackItemVotes.length === 0) {
                // If it's empty, delete the tech item from the database using Prisma ORM
                await this.prisma.teamTechStackItem.delete({
                    where: {
                        id: teamTechItemId,
                    },
                });

                return {
                    message: "The vote and tech stack item were deleted",
                    statusCode: 200,
                };
            } else {
                return {
                    message: "This vote was deleted",
                    statusCode: 200,
                };
            }
        } catch (e) {
            if (e.code === "P2025") {
                throw new NotFoundException(e.meta.cause);
            }
            throw e;
        }
    }
}
