import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
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
        const voyageTeamMember = await this.prisma.voyageTeamMember.findFirst({
            where: {
                userId: userId,
                voyageTeamId: teamId,
            },
            select: {
                id: true,
            },
        });
        if (!voyageTeamMember)
            throw new BadRequestException("Invalid UserId or TeamId");
        try {
            const createdIdeation = await this.prisma.projectIdea.create({
                data: {
                    voyageTeamMemberId: voyageTeamMember.id,
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
        } catch (e) {
            throw e;
        }
    }

    async createIdeationVote(
        teamId: number,
        ideationId: number,
        createIdeationVoteDto: CreateIdeationVoteDto,
    ) {
        const { userId } = createIdeationVoteDto;
        const voyageTeamMember = await this.prisma.voyageTeamMember.findFirst({
            where: {
                userId: userId,
                voyageTeamId: teamId,
            },
            select: {
                id: true,
            },
        });
        if (!voyageTeamMember)
            throw new BadRequestException("Invalid UserId or TeamId");
        const ideationExistsCheck = await this.prisma.projectIdea.findUnique({
            where: {
                id: ideationId,
            },
        });
        if (!ideationExistsCheck) {
            throw new NotFoundException(
                `Ideation (id: ${ideationId}) does not exist.`,
            );
        }

        try {
            const userHasVoted = await this.hasIdeationVote(
                voyageTeamMember.id,
                ideationId,
            );
            //if user has not voted then a vote can be created
            if (!userHasVoted) {
                const createVote = await this.prisma.projectIdeaVote.create({
                    data: {
                        voyageTeamMemberId: voyageTeamMember.id,
                        projectIdeaId: ideationId,
                    },
                });
                return createVote;
            } else {
                throw new ConflictException(
                    `User has already voted for ${ideationId}`,
                );
            }
        } catch (e) {
            throw e;
        }
    }

    async getIdeationsByVoyageTeam(id: number) {
        const teamMemberCheck = await this.prisma.voyageTeamMember.findFirst({
            where: {
                voyageTeamId: id,
            },
        });
        if (!teamMemberCheck)
            throw new NotFoundException(
                `voyageTeamId (id: ${id}) does not exist.`,
            );

        try {
            const teamProjectIdeas =
                await this.prisma.voyageTeamMember.findMany({
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
        } catch (e) {
            throw e;
        }
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
                userId: userId,
            },
            select: {
                id: true,
                userId: true,
            },
        });
        if (!voyageTeamMember)
            throw new BadRequestException(
                `Invalid teamMemberId (id: ${teamMemberId}) or userId (id: ${userId}).`,
            );

        const ideationExistsCheck = await this.prisma.projectIdea.findUnique({
            where: {
                id: ideationId,
            },
        });
        if (!ideationExistsCheck) {
            throw new NotFoundException(
                `Ideation (id: ${ideationId}) does not exist.`,
            );
        }

        try {
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
            } else {
                throw new ConflictException(
                    `voyageTeamMember.userId: ${voyageTeamMember.userId} on ideation does not match userId: ${userId} input.`,
                );
            }
        } catch (e) {
            throw e;
        }
    }

    async deleteIdeation(
        ideationId: number,
        deleteIdeationDto: DeleteIdeationDto,
    ) {
        const { userId } = deleteIdeationDto;
        let voteCount;
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
        if (!voyageTeamMember)
            throw new NotFoundException(
                `TeamMemberId (id: ${teamMemberId}) does not exist`,
            );
        const checkVotes = await this.getIdeationVoteCount(ideationId);
        if (checkVotes > 1) {
            throw new ConflictException(
                `Ideation cannot be deleted when others have voted for it.`,
            );
        }

        try {
            await this.deleteIdeationVote(
                voyageTeamMember.voyageTeamId,
                ideationId,
                deleteIdeationDto,
            );
            voteCount = await this.getIdeationVoteCount(ideationId);
            //only allow the user that created the idea to delete it and only if it has no votes
            if (voteCount === 0 && voyageTeamMember.userId === userId) {
                const deleteIdeation = await this.prisma.projectIdea.delete({
                    where: {
                        id: ideationId,
                    },
                });
                return deleteIdeation;
            }
        } catch (e) {
            throw e;
        }
    }

    async deleteIdeationVote(
        teamId: number,
        ideationId: number,
        deleteIdeationVoteDto: DeleteIdeationVoteDto,
    ) {
        const { userId } = deleteIdeationVoteDto;
        const voyageTeamMember = await this.prisma.voyageTeamMember.findFirst({
            where: {
                userId: userId,
                voyageTeamId: teamId,
            },
            select: {
                id: true,
            },
        });
        if (!voyageTeamMember)
            throw new BadRequestException("Invalid User or Team Id");
        const ideationVote = await this.getIdeationVote(
            ideationId,
            voyageTeamMember.id,
        );
        try {
            const deleteIdeationVote = await this.prisma.projectIdeaVote.delete(
                {
                    where: {
                        id: ideationVote.id,
                    },
                },
            );
            return deleteIdeationVote;
        } catch (e) {
            if (e.code === "P2002") {
                throw new NotFoundException(
                    `IdeationVote (id: ${ideationVote.id}) does not exist.`,
                );
            }
            throw e;
        }
    }

    private async getTeamMemberIdByIdeation(ideationId: number) {
        const voyageTeamMember = await this.prisma.projectIdea.findFirst({
            where: {
                id: ideationId,
            },
            select: {
                voyageTeamMemberId: true,
            },
        });
        if (!voyageTeamMember)
            throw new NotFoundException(
                `Ideation (id: ${ideationId}) does not exist`,
            );
        return voyageTeamMember.voyageTeamMemberId;
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
        if (!checkVoteStatus)
            throw new BadRequestException(
                "Invalid Ideation Id or Team Memeber Id",
            );
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
        if (!votesForIdeation)
            throw new NotFoundException(
                `Ideation (id: ${ideationId}) does not exist`,
            );
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
        if (!oneIdeationVote)
            throw new BadRequestException(
                "Invalid Ideation Id or Team Member Id",
            );
        return oneIdeationVote;
    }
}
