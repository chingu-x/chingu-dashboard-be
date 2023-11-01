import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";
import { CreateIdeationVoteDto } from "./dto/create-ideation-vote.dto";
import { DeleteIdeationVoteDto } from "./dto/delete-ideation-vote.dto";
import { DeleteIdeationDto } from "./dto/delete-ideation.dto";

@Injectable()
export class IdeationsService {
    constructor(private prisma: PrismaService) {}

    async createIdeation(teamId: number, createIdeationDto: CreateIdeationDto) {
        const { userId, title, description, vision } = createIdeationDto;
        const { id: voyageTeamMemberId } =
            await this.prisma.voyageTeamMember.findFirst({
                where: {
                    userId: userId,
                    voyageTeamId: teamId,
                },
                select: {
                    id: true,
                },
            });
        const createdIdeation = await this.prisma.projectIdea.create({
            data: {
                voyageTeamMemberId,
                title,
                description,
                vision,
            },
        });
        const createIdeationVoteDto = { userId: userId };
        await this.createIdeationVote(
            teamId,
            createdIdeation.id,
            createIdeationVoteDto,
        );
        return createdIdeation;
    }

    async createIdeationVote(
        teamId: number,
        ideationId: number,
        createIdeationVoteDto: CreateIdeationVoteDto,
    ) {
        const { userId } = createIdeationVoteDto;
        const { id: voyageTeamMemberId } =
            await this.prisma.voyageTeamMember.findFirst({
                where: {
                    userId: userId,
                    voyageTeamId: teamId,
                },
                select: {
                    id: true,
                },
            });
        const userHasVoted = await this.hasIdeationVote(
            voyageTeamMemberId,
            ideationId,
        );
        //if user has not voted then a vote can be created
        if (!userHasVoted) {
            const createVote = await this.prisma.projectIdeaVote.create({
                data: {
                    voyageTeamMemberId,
                    projectIdeaId: ideationId,
                },
            });

            const votedBy = await this.prisma.voyageTeamMember.findFirst({
                where: {
                    id: createVote.voyageTeamMemberId,
                },
                select: {
                    member: {
                        select: {
                            id: true,
                            avatar: true,
                        },
                    },
                },
            });

            return {
                ...createVote,
                votedBy,
            };
        }
    }

    async getIdeationsByVoyageTeam(id: number) {
        const teamProjectIdeas = await this.prisma.voyageTeamMember.findMany({
            where: {
                voyageTeamId: id,
            },
            select: {
                projectIdeas: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        vision: true,
                        createdAt: true,
                        contributedBy: {
                            select: {
                                member: {
                                    select: {
                                        id: true,
                                        avatar: true,
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        projectIdeaVotes: {
                            include: {
                                votedBy: {
                                    select: {
                                        member: {
                                            select: {
                                                id: true,
                                                avatar: true,
                                                firstName: true,
                                                lastName: true,
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
        return teamProjectIdeas
            .map((teamMember) => teamMember.projectIdeas)
            .flat();
    }

    async updateIdeation(
        ideationId: number,
        updateIdeationDto: UpdateIdeationDto,
    ) {
        const { userId, title, description, vision } = updateIdeationDto;
        const teamMemberId = await this.getTeamMemberIdByIdeation(ideationId);
        const voyageTeamMember = await this.prisma.voyageTeamMember.findFirst({
            where: {
                id: teamMemberId,
            },
            select: {
                id: true,
                userId: true,
            },
        });
        //only allow the user that created the idea to edit it
        if (voyageTeamMember.userId === userId) {
            const updatedIdeation = await this.prisma.projectIdea.update({
                where: {
                    id: ideationId,
                },
                data: {
                    title,
                    description,
                    vision,
                },
            });
            return updatedIdeation;
        }
    }

    async deleteIdeation(
        ideationId: number,
        deleteIdeationDto: DeleteIdeationDto,
    ) {
        const { userId } = deleteIdeationDto;
        const teamMemberId = await this.getTeamMemberIdByIdeation(ideationId);
        const voyageTeamMember = await this.prisma.voyageTeamMember.findFirst({
            where: {
                id: teamMemberId,
            },
            select: {
                id: true,
                userId: true,
                voyageTeamId: true,
            },
        });
        await this.deleteIdeationVote(
            voyageTeamMember.voyageTeamId,
            ideationId,
            deleteIdeationDto,
        );
        const voteCount = await this.getIdeationVoteCount(ideationId);
        //only allow the user that created the idea to delete it and only if it has no votes
        if (voteCount === 0 && voyageTeamMember.userId === userId) {
            const deleteIdeation = await this.prisma.projectIdea.delete({
                where: {
                    id: ideationId,
                },
            });
            return deleteIdeation;
        }
    }

    async deleteIdeationVote(
        teamId: number,
        ideationId: number,
        deleteIdeationVoteDto: DeleteIdeationVoteDto,
    ) {
        const { userId } = deleteIdeationVoteDto;
        const { id: voyageTeamMemberId } =
            await this.prisma.voyageTeamMember.findFirst({
                where: {
                    userId: userId,
                    voyageTeamId: teamId,
                },
                select: {
                    id: true,
                },
            });
        const { id: ideationVoteId } = await this.getIdeationVote(
            ideationId,
            voyageTeamMemberId,
        );
        const deleteIdeationVote = await this.prisma.projectIdeaVote.delete({
            where: {
                id: ideationVoteId,
            },
        });
        return deleteIdeationVote;
    }

    private async getTeamMemberIdByIdeation(ideationId: number) {
        const { voyageTeamMemberId: teamMemberId } =
            await this.prisma.projectIdea.findFirst({
                where: {
                    id: ideationId,
                },
                select: {
                    voyageTeamMemberId: true,
                },
            });
        return teamMemberId;
    }

    private async hasIdeationVote(teamMemberId: number, ideationId: number) {
        const checkVoteStatus = await this.prisma.projectIdeaVote.findMany({
            where: {
                voyageTeamMemberId: teamMemberId,
                projectIdeaId: ideationId,
            },
            select: {
                id: true,
            },
        });
        return checkVoteStatus.length > 0;
    }

    private async getIdeationVoteCount(ideationId: number) {
        const votesForIdeation = await this.prisma.projectIdeaVote.findMany({
            where: {
                projectIdeaId: ideationId,
            },
            select: {
                id: true,
            },
        });
        return votesForIdeation.length;
    }

    private async getIdeationVote(
        ideationId: number,
        voyageTeamMemberId: number,
    ) {
        const oneIdeationVote = await this.prisma.projectIdeaVote.findFirst({
            where: {
                projectIdeaId: ideationId,
                voyageTeamMemberId: voyageTeamMemberId,
            },
            select: {
                id: true,
            },
        });
        return oneIdeationVote;
    }
}
