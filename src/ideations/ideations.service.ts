import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";
import { GlobalService } from "../global/global.service";
import { CustomRequest } from "../global/types/CustomRequest";
import { manageOwnVoyageTeamWithIdParam } from "../ability/conditions/voyage-teams.ability";

@Injectable()
export class IdeationsService {
    constructor(
        private prisma: PrismaService,
        private readonly globalService: GlobalService,
    ) {}

    async createIdeation(
        req: CustomRequest,
        teamId: number,
        createIdeationDto: CreateIdeationDto,
    ) {
        const { title, description, vision } = createIdeationDto;

        try {
            // user can create Ideation for their own team(s)
            manageOwnVoyageTeamWithIdParam(req.user, teamId);
            const createdIdeation = await this.prisma.projectIdea.create({
                data: {
                    voyageTeamMemberId:
                        this.globalService.getVoyageTeamMemberId(req, teamId),
                    title,
                    description,
                    vision,
                },
            });

            await this.createIdeationVote(req, teamId, createdIdeation.id);
            return createdIdeation;
        } catch (e) {
            throw e;
        }
    }

    async createIdeationVote(req, teamId: number, ideationId: number) {
        // user can create Ideation votes for their own team(s)
        manageOwnVoyageTeamWithIdParam(req.user, teamId);
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
                this.globalService.getVoyageTeamMemberId(req, teamId),
                ideationId,
            );
            //if user has not voted then a vote can be created
            if (!userHasVoted) {
                const createVote = await this.prisma.projectIdeaVote.create({
                    data: {
                        voyageTeamMemberId:
                            this.globalService.getVoyageTeamMemberId(
                                req,
                                teamId,
                            ),
                        projectIdeaId: ideationId,
                    },
                });
                return createVote;
            } else {
                throw new ConflictException(
                    `User has already voted for ideationId: ${ideationId}`,
                );
            }
        } catch (e) {
            throw e;
        }
    }

    async getIdeationsByVoyageTeam(req: CustomRequest, id: number) {
        // user can read Ideation votes for their own team(s)
        manageOwnVoyageTeamWithIdParam(req.user, id);
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
                                updatedAt: true,
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
        req: CustomRequest,
        ideationId: number,
        teamId: number,
        updateIdeationDto: UpdateIdeationDto,
    ) {
        const { title, description, vision } = updateIdeationDto;

        const voyageTeamMemberId = this.globalService.getVoyageTeamMemberId(
            req,
            teamId,
        );

        const ideationExistsCheck = await this.prisma.projectIdea.findUnique({
            where: {
                id: ideationId,
            },
            select: {
                voyageTeamMemberId: true,
            },
        });
        if (!ideationExistsCheck) {
            throw new NotFoundException(
                `Ideation (id: ${ideationId}) does not exist.`,
            );
        }

        try {
            //only allow the user that created the idea to edit it
            if (voyageTeamMemberId === ideationExistsCheck.voyageTeamMemberId) {
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
                throw new ForbiddenException(
                    "[Ideation Service]:  You can only update your own project ideas.",
                );
            }
        } catch (e) {
            throw e;
        }
    }

    async deleteIdeation(req: CustomRequest, teamId, ideationId: number) {
        let voteCount: number;

        const checkVotes = await this.getIdeationVoteCount(ideationId);
        if (checkVotes > 1) {
            throw new ConflictException(
                `Ideation cannot be deleted when others have voted for it.`,
            );
        }
        try {
            await this.deleteIdeationVote(req, teamId, ideationId);
            console.log(req.user, teamId, ideationId);
            voteCount = await this.getIdeationVoteCount(ideationId);
            console.log(voteCount);
            //only allow the user that created the idea to delete it and only if it has no votes
            if (voteCount === 0) {
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
        req: CustomRequest,
        teamId: number,
        ideationId: number,
    ) {
        const voyageTeamMemberId = this.globalService.getVoyageTeamMemberId(
            req,
            teamId,
        );
        const ideationVote = await this.getIdeationVote(
            ideationId,
            voyageTeamMemberId,
        );
        console.log(ideationVote);
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
                `Invalid Ideation Id or Team Member Id. The user (teamMemberId:${teamMemberId}) does not have a vote for ideation id: ${ideationId}`,
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
                `Invalid Ideation Id or Team Member Id. The user (teamMemberId:${voyageTeamMemberId}) does not have a vote for ideation id: ${ideationId}`,
            );
        return oneIdeationVote;
    }
}
