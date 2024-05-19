import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTeamTechDto } from "./dto/create-tech.dto";
import { UpdateTechSelectionsDto } from "./dto/update-tech-selections.dto";
import { UpdateTeamTechDto } from "./dto/update-tech.dto";
import { CustomRequest } from "src/global/types/CustomRequest";

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

    validTeamMember = (req: CustomRequest, teamId: number) => {
        // teams of which the logged in user is a member
        const teams = req.user.voyageTeams;

        // check if the teamId is in the teams array
        const voyageMember = teams.filter((team) => team.teamId === teamId);
        if (voyageMember.length === 0) {
            throw new BadRequestException("Not a Valid user");
        }

        return voyageMember[0].memberId;
    };

    findVoyageMemberId = async (
        req,
        teamId: number,
    ): Promise<number> | null => {
        const uuid = req.user.userId;
        const voyageMember = await this.prisma.voyageTeamMember.findUnique({
            where: {
                userVoyageId: {
                    userId: uuid,
                    voyageTeamId: teamId,
                },
            },
        });
        return voyageMember ? voyageMember.id : null;
    };

    getAllTechItemsByTeamId = async (teamId: number) => {
        this.validateTeamId(teamId);

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
        req,
        teamId: number,
        updateTechSelectionsDto: UpdateTechSelectionsDto,
    ) {
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

        const voyageMemberId = await this.findVoyageMemberId(req, teamId);
        if (!voyageMemberId)
            throw new BadRequestException("Invalid User or Team Id");

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
        req,
        teamId: number,
        createTechVoteDto: CreateTeamTechDto,
    ) {
        // TODO: To Check if the voyageTeamMemberId in request body is in the voyageTeam

        //check for valid teamId
        await this.validateTeamId(teamId);
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
                addedBy: {
                    select: {
                        member: {
                            select: {
                                id: true,
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

        // check if the logged in user is the one who added the tech stack item

        if (req.user.userId !== teamTechItem.addedBy.member.id) {
            throw new ForbiddenException(
                "[Tech Service]:  You can only update your own Tech Stack Item.",
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

    async deleteTeamTech(req, teamTechItemId: number) {
        try {
            // check if team tech item exists

            const teamTechItem = await this.prisma.teamTechStackItem.findUnique(
                {
                    where: {
                        id: teamTechItemId,
                    },
                    select: {
                        addedBy: {
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
            );

            if (!teamTechItem)
                throw new NotFoundException(
                    `[Tech Service]: Team Tech Stack Item with id:${teamTechItemId} not found`,
                );

            // check if the logged in user is the one who added the tech stack item

            if (req.user.userId !== teamTechItem.addedBy.member.id) {
                throw new ForbiddenException(
                    "[Tech Service]:  You can only delete your own Tech Stack Item.",
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

    async addExistingTechVote(req, teamTechItemId: number) {
        // check if team tech item exists
        const teamTechItem = await this.prisma.teamTechStackItem.findUnique({
            where: {
                id: teamTechItemId,
            },
        });

        if (!teamTechItem)
            throw new BadRequestException("Team Tech Item not found");

        // check if the user is a member of the team
        // Note: This can be removed after new authorization is implemented
        const voyageMemberId = this.validTeamMember(
            req,
            teamTechItem.voyageTeamId,
        );

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
                teamTechItemId,
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
            throw new BadRequestException("Team Tech Item not found");

        // check if the user is a member of the team
        // Note: This can be removed after new authorization is implemented
        const voyageMemberId = this.validTeamMember(
            req,
            teamTechItem.voyageTeamId,
        );

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
