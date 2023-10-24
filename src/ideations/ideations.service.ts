import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";
import { CreateIdeationVoteDto } from "./dto/create-ideation-vote.dto";

//const USER_ID = "bf24212d-403f-4459-aa76-d9abc701a3bf";
//const UserId = 10;


//PROJECT IDEA SERVICES
@Injectable()
export class IdeationsService {
    constructor(private prisma: PrismaService) {}

    async createIdeation(teamId: number, userId: string, createIdeationDto: CreateIdeationDto) {
        const { title, description, vision } = createIdeationDto;
        const {id: voyageTeamMemberId} = await this.prisma.voyageTeamMember.findFirst({
            where: {
                userId: userId,
                voyageTeamId: teamId,
            },
            select: {
                id: true,
            }
        })
        const createdIdeation = await this.prisma.projectIdea.create({
            data: {
                voyageTeamMemberId,
                title,
                description,
                vision
            },
        });
        return createdIdeation;
    }

    async getIdeationsByVoyageTeam(id: number) {
        const teamProjectIdeas = await this.prisma.voyageTeamMember.findMany({
            where: {
                voyageTeamId: id
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
                                    include: {
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
        return teamProjectIdeas.map((teamMember) => teamMember.projectIdeas).flat();
    }

    async getTeamMemberIdByIdeation (ideationId: number){
        const {voyageTeamMemberId: teamMemberId} = await this.prisma.projectIdea.findFirst({
            where: {
                id: ideationId
            },
            select: {
                voyageTeamMemberId: true,
            }
        })
        return teamMemberId;
    }

    async updateIdeation(ideationId: number,  userId: string, updateIdeationDto: UpdateIdeationDto,) {
        const { title, description, vision } = updateIdeationDto;
        const teamMemberId = await this.getTeamMemberIdByIdeation(ideationId)
        const voyageTeamMember = await this.prisma.voyageTeamMember.findFirst({
            where: {
                id: teamMemberId
            },
            select: {
                id: true,
                userId: true
            }
        })
        //only allow the user that created the idea to edit it
        if(voyageTeamMember.userId === userId) {
            const updatedIdeation = await this.prisma.projectIdea.update({
                where: {
                    id: ideationId
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

    async deleteIdeation(userId: string, ideationId: number) {
        const teamMemberId = await this.getTeamMemberIdByIdeation(ideationId)
        const voteCount = await this.getIdeationVoteCount(ideationId)
        const voyageTeamMember = await this.prisma.voyageTeamMember.findFirst({
            where: {
                id: teamMemberId
            },
            select: {
                id: true,
                userId: true
            }
        })
        //only allow the user that created the idea to delete it and only if it has no votes
        if(voteCount === 0 && voyageTeamMember.userId === userId ){
            const deleteIdeation = await this.prisma.projectIdea.delete({
                where: {
                    id: ideationId
                },
            });
            return deleteIdeation;
        }
    }

    async createIdeationVote(userId: string, teamId: number, CreateIdeationVoteDto: CreateIdeationVoteDto) {
        const { projectIdeaId } = CreateIdeationVoteDto;
        const {id: voyageTeamMemberId} = await this.prisma.voyageTeamMember.findFirst({
            where: {
                userId: userId,
                voyageTeamId: teamId
            },
            select: {
                id: true
            }
        })
        const userHasVoted = await this.hasIdeationVote(voyageTeamMemberId, projectIdeaId)
        //if user has not voted then a vote can be created
        if (!userHasVoted){
            const createVote = await this.prisma.projectIdeaVote.create({
                data: {
                    voyageTeamMemberId,
                    projectIdeaId
                }
            });
            return createVote;
        }
    }

    async hasIdeationVote(teamMemberId: number, ideationId: number){
        const checkVoteStatus = await this.prisma.projectIdeaVote.findMany({
            where: {
                voyageTeamMemberId: teamMemberId,
                projectIdeaId: ideationId
            },
            select: {
                id: true
            }
        })
        return checkVoteStatus.length > 0;
    }

    async getIdeationVoteCount(ideationId: number){
        const votesForIdeation = await this.prisma.projectIdeaVote.findMany({
            where: {
                projectIdeaId: ideationId
            },
            select: {
                id: true
            }
        })
        return votesForIdeation.length;
    }

    async getIdeationVote(projectIdeaId: number, voyageTeamMemberId: number){
        const oneIdeationVote = await this.prisma.projectIdeaVote.findFirst({
            where: {
                projectIdeaId: projectIdeaId,
                voyageTeamMemberId: voyageTeamMemberId
            },
            select: {
                id: true
            }
        })
        return oneIdeationVote;
    }

    async deleteIdeationVote( userId: string, teamId: number, ideationId: number){
        const {id: voyageTeamMemberId} = await this.prisma.voyageTeamMember.findFirst({
            where: {
                userId: userId,
                voyageTeamId: teamId
            },
            select: {
                id: true
            }
        })
        const {id: ideationVoteId} = await this.getIdeationVote( ideationId, voyageTeamMemberId )
        const deleteIdeationVote = await this.prisma.projectIdeaVote.delete({
            where: {
                id: ideationVoteId,
            },
        });
        console.log("deleted Vote", deleteIdeationVote)
        return deleteIdeationVote;
    }
}
