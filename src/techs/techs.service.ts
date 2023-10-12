import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTechVoteDto } from "./dto/create-tech-vote.dto";

@Injectable()
export class TechsService {
    constructor(private prisma: PrismaService) {}

    // Note: userId will eventually come from the auth header
    findVoyageMemberId = async (
        userId: string,
        teamId: number,
    ): Promise<number> | null => {
        const voyageMember = await this.prisma.voyageTeamMember.findUnique({
            where: {
                userVoyageId: {
                    userId: userId,
                    voyageTeamId: teamId,
                },
            },
        });
        return voyageMember ? voyageMember.id : null;
    };

    findAllByTeamId(id: number) {
        return this.prisma.teamTechStackItem.findMany({
            where: {
                voyageTeamId: id,
            },
            select: {
                id: true,
                tech: {
                    select: {
                        id: true,
                        category: {
                            select: {
                                name: true,
                            },
                        },
                        name: true,
                    },
                },
                teamTechStackItemVotes: {
                    select: {
                        votedBy: {
                            select: {
                                member: {
                                    select: {
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
    }

    getAllTechItemsByTeamId(id: number) {
        return this.prisma.techStackCategory.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                techStackItems: {
                    select: {
                        id: true,
                        name: true,
                        teamTechStacks: {
                            where: {
                                voyageTeamId: id,
                            },
                            select: {
                                id: true,
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
                },
            },
        });
    }

    async addNewTechVote(teamId, techId, createTechVoteDto: CreateTechVoteDto) {
        const voyageMemberId = await this.findVoyageMemberId(
            createTechVoteDto.votedBy,
            teamId,
        );
        if (!voyageMemberId) throw new BadRequestException("Invalid User");

        const newTeamTechItem = await this.prisma.teamTechStackItem.create({
            data: {
                voyageTeamId: teamId,
                techId: techId,
            },
        });

        return this.prisma.teamTechStackItemVote.create({
            data: {
                teamTechId: newTeamTechItem.id,
                teamMemberId: voyageMemberId,
            },
        });
    }

    async addExistingTechVote(
        teamId,
        teamTechId,
        createTechVoteDto: CreateTechVoteDto,
    ) {
        const voyageMemberId = await this.findVoyageMemberId(
            createTechVoteDto.votedBy,
            teamId,
        );
        if (!voyageMemberId) throw new BadRequestException("Invalid User");

        return this.prisma.teamTechStackItemVote.create({
            data: {
                teamTechId,
                teamMemberId: voyageMemberId,
            },
        });
    }

    async removeVote(teamId, teamTechId, createTechVoteDto: CreateTechVoteDto) {
        const voyageMemberId = await this.findVoyageMemberId(
            createTechVoteDto.votedBy,
            teamId,
        );

        const deletedVote = await this.prisma.teamTechStackItemVote.delete({
            where: {
                userTeamStackVote: {
                    teamTechId,
                    teamMemberId: voyageMemberId,
                },
            },
        });

        // check if it was the last vote, if so, also delete the team tech item entry
        const teamTechItem = await this.prisma.teamTechStackItem.findUnique({
            where: {
                id: teamTechId,
            },
            select: {
                teamTechStackItemVotes: true,
            },
        });

        if (teamTechItem.teamTechStackItemVotes.length === 0) {
            return this.prisma.teamTechStackItem.delete({
                where: {
                    id: teamTechId,
                },
            });
        } else {
            return deletedVote;
        }
    }
}
