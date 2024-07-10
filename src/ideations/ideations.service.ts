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
import { manageOwnIdeationById } from "../ability/conditions/ideations.ability";

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

            await this.createIdeationVote(req, createdIdeation.id);
            return createdIdeation;
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
                                isSelected: true,
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
        // teamId: number,
        updateIdeationDto: UpdateIdeationDto,
    ) {
        const { title, description, vision } = updateIdeationDto;

        await manageOwnIdeationById(req.user, ideationId);

        // TODO: might need to check if user can update it
        //  (they should only be able to update it when they have the only vote)
        try {
            //only allow the user that created the idea to edit it
            return this.prisma.projectIdea.update({
                where: {
                    id: ideationId,
                },
                data: {
                    title,
                    description,
                    vision,
                },
            });
        } catch (e) {
            throw e;
        }
    }

    async deleteIdeation(req: CustomRequest, ideationId: number) {
        const voteCount = await this.checkIdeationAndVotes(ideationId);
        if (voteCount > 1) {
            throw new ConflictException(
                `Ideation cannot be deleted when others have voted for it.`,
            );
        }
        try {
            await this.removeVote(req, ideationId);
            return await this.removeIdeation(ideationId);
        } catch (e) {
            throw e;
        }
    }

    async createIdeationVote(req: CustomRequest, ideationId: number) {
        // user can create Ideation votes for their own team(s)
        const ideationToVote = await this.prisma.projectIdea.findUnique({
            where: {
                id: ideationId,
            },
            select: {
                contributedBy: {
                    select: {
                        voyageTeamId: true,
                    },
                },
                voyageTeamMemberId: true,
            },
        });

        // ideation belongs to ideationToVote.contributedBy.voyageTeamId (and their voyageTeamMember id is ideationToVote.voyageTeamMemberId)
        // (The contributor, not necessarily the voter but we can derive the voters voyageTeamMemberId from this
        if (!ideationToVote) {
            throw new NotFoundException(
                `Ideation (id: ${ideationId}) does not exist.`,
            );
        }

        // get voyageTeamMemberId from ideationId
        const voyageTeamMemberId = req.user.voyageTeams.find(
            (vt) => vt.teamId === ideationToVote.contributedBy?.voyageTeamId,
        )?.memberId;

        // if voyageTeamMember is not found that means user is not in the team which owns the ideation
        if (!voyageTeamMemberId)
            throw new ForbiddenException(
                "Forbidden: user is not authorized to access this resource.",
            );

        try {
            const userHasVoted = await this.hasIdeationVote(req, ideationId);
            //if user has not voted then a vote can be created
            if (!userHasVoted) {
                const createVote = await this.prisma.projectIdeaVote.create({
                    data: {
                        voyageTeamMemberId,
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

    async deleteIdeationVote(req: CustomRequest, ideationId: number) {
        try {
            const deleteIdeationVote = await this.removeVote(req, ideationId);
            //delete ideation if no remaining votes
            const voteCount = await this.checkIdeationAndVotes(ideationId);
            if (voteCount === 0) {
                await this.removeIdeation(ideationId);
            }
            return deleteIdeationVote;
        } catch (e) {
            throw e;
        }
    }

    async getSelectedIdeation(teamId: number) {
        //get all team member ids
        const teamMemberIds = await this.prisma.voyageTeamMember.findMany({
            where: {
                voyageTeamId: teamId,
            },
            select: {
                id: true,
            },
        });
        //extract ids into array
        const idArray = teamMemberIds.map((member) => member.id);
        //search all team member project ideas for isSelected === true
        return this.prisma.projectIdea.findFirst({
            where: {
                voyageTeamMemberId: {
                    in: idArray,
                },
                isSelected: true,
            },
        });
    }

    async setIdeationSelection(
        req: CustomRequest,
        teamId: number,
        ideationId: number,
    ) {
        manageOwnVoyageTeamWithIdParam(req.user, teamId);
        try {
            const currentSelection = await this.getSelectedIdeation(teamId);
            if (currentSelection) {
                throw new ConflictException(
                    `Ideation already selected for team ${teamId}`,
                );
            }
            return await this.prisma.projectIdea.update({
                where: {
                    id: ideationId,
                },
                data: {
                    isSelected: true,
                },
            });
        } catch (e) {
            if (e.code === "P2025") {
                throw new NotFoundException(e.meta.cause);
            }
            throw e;
        }
    }

    async resetIdeationSelection(req: CustomRequest, teamId: number) {
        try {
            //find current selection, if any
            const selection = await this.getSelectedIdeation(teamId);
            if (selection) {
                return await this.prisma.projectIdea.update({
                    where: {
                        id: selection.id,
                    },
                    data: {
                        isSelected: false,
                    },
                });
            }
        } catch (e) {
            throw e;
        }
        //default
        throw new NotFoundException(`no ideation found for team ${teamId}`);
    }

    private async hasIdeationVote(req: CustomRequest, ideationId: number) {
        const checkVoteStatus = await this.prisma.projectIdeaVote.findMany({
            where: {
                voyageTeamMemberId: {
                    in: req.user.voyageTeams.map((vt) => vt.memberId),
                },
                projectIdeaId: ideationId,
            },
            select: {
                id: true,
            },
        });
        return checkVoteStatus.length > 0;
    }

    // check ideation Id exists and return the vote count
    private async checkIdeationAndVotes(ideationId: number) {
        const ideation = await this.prisma.projectIdea.findUnique({
            where: {
                id: ideationId,
            },
        });
        if (!ideation) {
            throw new NotFoundException();
        }
        return this.prisma.projectIdeaVote.count({
            where: {
                projectIdeaId: ideationId,
            },
        });
    }

    private async removeIdeation(ideationId: number) {
        return this.prisma.projectIdea.delete({
            where: {
                id: ideationId,
            },
        });
    }

    private async removeVote(req: CustomRequest, ideationId: number) {
        try {
            const ideationVote = await this.prisma.projectIdeaVote.findFirst({
                where: {
                    projectIdeaId: ideationId,
                    voyageTeamMemberId: {
                        in: req.user.voyageTeams.map((vt) => vt.memberId),
                    },
                },
                select: {
                    id: true,
                },
            });
            if (!ideationVote)
                throw new BadRequestException(
                    `Invalid Ideation Id or Team Member Id. The user does not have a vote for ideation id: ${ideationId}`,
                );

            return await this.prisma.projectIdeaVote.delete({
                where: {
                    id: ideationVote.id,
                },
            });
        } catch (e) {
            if (e.code === "P2002") {
                throw new NotFoundException(
                    `Vote for ideation (id=${ideationId}) does not exist for the user.`,
                );
            }
            throw e;
        }
    }
}
