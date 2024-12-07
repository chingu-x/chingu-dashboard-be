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
import { CreateTechStackCategoryDto } from "./dto/create-techstack-category.dto";
import { UpdateTechStackCategoryDto } from "./dto/update-techstack-category.dto";
import { UpdateTechSelectionDto } from "./dto/update-tech-selections.dto";
import { UpdateTeamTechDto } from "./dto/update-tech.dto";
import { CustomRequest, UserReq } from "../global/types/CustomRequest";
import { manageOwnVoyageTeamWithIdParam } from "@/ability/conditions/voyage-teams.ability";

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
            where: {
                voyageTeamId: teamId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                teamTechStackItems: {
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
        techId: number,
        updateTechSelectionsDto: UpdateTechSelectionDto,
    ) {
        const isSelected = updateTechSelectionsDto.isSelected;
        const tech = await this.prisma.teamTechStackItem.findUnique({
            where: {
                id: techId,
            },
            select: {
                categoryId: true,
                voyageTeamId: true,
            },
        });
        if (!tech) {
            throw new NotFoundException(`Tech ${techId} not found.`);
        }

        //check if user is a member of the team
        manageOwnVoyageTeamWithIdParam(req.user, tech.voyageTeamId);

        //get all selected techs from this category
        const teamTechs = await this.prisma.teamTechStackItem.findMany({
            where: {
                categoryId: tech.categoryId,
                isSelected: true,
            },
            select: {
                categoryId: true,
            },
        });

        if (teamTechs.length >= MAX_SELECTION_COUNT && isSelected === true) {
            throw new BadRequestException(
                `Only ${MAX_SELECTION_COUNT} selections allowed per category`,
            );
        } else {
            return this.prisma.teamTechStackItem.update({
                where: {
                    id: techId,
                },
                data: {
                    isSelected: isSelected,
                },
            });
        }
    }

    async addNewTeamTech(
        req: CustomRequest,
        teamId: number,
        createTeamTechDto: CreateTeamTechDto,
    ) {
        //check for valid teamId
        await this.validateTeamId(teamId);

        await this.userCanChangeCategory(
            createTeamTechDto.techCategoryId,
            req.user,
            teamId,
        );

        try {
            const newTeamTechItem = await this.prisma.teamTechStackItem.create({
                data: {
                    name: createTeamTechDto.techName,
                    categoryId: createTeamTechDto.techCategoryId,
                    voyageTeamId: teamId,
                    voyageTeamMemberId: createTeamTechDto.voyageTeamMemberId,
                },
            });

            const TeamTechItemFirstVote =
                await this.prisma.teamTechStackItemVote.create({
                    data: {
                        teamTechId: newTeamTechItem.id,
                        teamMemberId: createTeamTechDto.voyageTeamMemberId,
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
                    `${createTeamTechDto.techName} already exists in the available team tech stack.`,
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

    async addNewTechStackCategory(
        req: CustomRequest,
        teamId: number,
        createTechStackCategoryDto: CreateTechStackCategoryDto,
    ) {
        manageOwnVoyageTeamWithIdParam(req.user, teamId);

        try {
            const categoryData = {
                name: createTechStackCategoryDto.name,
                description: createTechStackCategoryDto.description,
                voyageTeamId: teamId,
            };
            const newTeamTechCategory =
                await this.prisma.techStackCategory.create({
                    data: { ...categoryData },
                });
            return newTeamTechCategory;
        } catch (e) {
            if (e.code === "P2002") {
                throw new ConflictException(
                    `Category ${createTechStackCategoryDto.name} already exists for this team.`,
                );
            }
            throw e;
        }
    }

    async updateTechStackCategory(
        req: CustomRequest,
        techStackCategoryId: number,
        updateTechStackCategoryDto: UpdateTechStackCategoryDto,
    ) {
        await this.userCanChangeCategory(techStackCategoryId, req.user);

        try {
            const newTechStackCategory =
                await this.prisma.techStackCategory.update({
                    where: {
                        id: techStackCategoryId,
                    },
                    data: {
                        name: updateTechStackCategoryDto.newName,
                        description: updateTechStackCategoryDto.description,
                    },
                });
            return newTechStackCategory;
        } catch (e) {
            if (e.code === "P2002") {
                throw new ConflictException(
                    `Category ${updateTechStackCategoryDto.newName} already exists for this team.`,
                );
            }
            throw e;
        }
    }

    async deleteTechStackCategory(
        req: CustomRequest,
        techStackCategoryId: number,
    ) {
        await this.userCanChangeCategory(techStackCategoryId, req.user);

        try {
            await this.prisma.techStackCategory.delete({
                where: { id: techStackCategoryId },
            });

            return {
                message: "The  tech stack category is deleted",
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

    private async userCanChangeCategory(
        categoryId: number,
        user: UserReq,
        teamId: number | undefined = undefined,
    ) {
        if (user.roles?.includes("admin")) return;

        let match;
        try {
            match = await this.prisma.techStackCategory.findUnique({
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
    }
}
