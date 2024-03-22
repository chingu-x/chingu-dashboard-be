import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTeamTechDto } from "./dto/create-tech.dto";
import { UpdateTechSelectionsDto } from "./dto/update-tech-selections.dto";

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

    findSelectedTechInCategory = async (
        voyageTeamId: number,
        categoryId: number,
    ) => {
        this.validateTeamId(voyageTeamId);
        return this.prisma.teamTechStackItem.findFirst({
            where: {
                voyageTeamId,
                categoryId,
                isSelected: true,
            },
        });
    };

    async updateTechStackSelections(
        req,
        teamId: number,
        updateTechSelectionsDto: UpdateTechSelectionsDto,
    ) {
        let test: any[];
        const voyageMemberId = await this.findVoyageMemberId(req, teamId); //TODO:
        if (!voyageMemberId)
            throw new BadRequestException("Invalid User or Team Id"); // extract to function
        for (const tech of updateTechSelectionsDto.techs) {
            //test += `techId: ${tech.techId} categoryId: ${tech.categoryId}\n`;
            // //clear current selection
            // const currentSelection = await this.findSelectedTechInCategory(
            //     teamId,
            //     categoryId,
            // );
            // if (currentSelection) {
            //     this.prisma.teamTechStackItem.update({
            //         where: {
            //             id: currentSelection.id,
            //         },
            //         data: {
            //             isSelected: false,
            //         },
            //     });
            // }

            //set new selection
            // test = await this.prisma.teamTechStackItem.update({
            //     where: {
            //         id: tech.techId,
            //     },
            //     data: {
            //         isSelected: true,
            //     },
            // });
            try {
                const trial = await this.prisma.teamTechStackItem.update({
                    where: {
                        id: tech.techId,
                    },
                    data: {
                        isSelected: true,
                    },
                });
                test.push({ techId: tech.techId });
                //test += `techId: ${tech.techId}\n`;
                //return trial;
            } catch (e) {
                if (e.code === "P2025") {
                    throw new NotFoundException(`Invalid`);
                }
            }
        }
        return JSON.stringify(test); //Json
    }

    async addNewTeamTech(
        req,
        teamId: number,
        createTechVoteDto: CreateTeamTechDto,
    ) {
        const voyageMemberId = await this.findVoyageMemberId(req, teamId);
        if (!voyageMemberId)
            throw new BadRequestException("Invalid User or Team Id");

        try {
            const newTeamTechItem = await this.prisma.teamTechStackItem.create({
                data: {
                    name: createTechVoteDto.techName,
                    categoryId: createTechVoteDto.techCategoryId,
                    voyageTeamId: teamId,
                },
            });

            return this.prisma.teamTechStackItemVote.create({
                data: {
                    teamTechId: newTeamTechItem.id,
                    teamMemberId: voyageMemberId,
                },
            });
        } catch (e) {
            if (e.code === "P2002") {
                throw new ConflictException(
                    `${createTechVoteDto.techName} already exists in the available team tech stack.`,
                );
            }
            throw e;
        }
    }

    async addExistingTechVote(req, teamId, teamTechId) {
        const voyageMemberId = await this.findVoyageMemberId(req, teamId);
        if (!voyageMemberId) throw new BadRequestException("Invalid User");

        try {
            return await this.prisma.teamTechStackItemVote.create({
                data: {
                    teamTechId,
                    teamMemberId: voyageMemberId,
                },
            });
        } catch (e) {
            if (e.code === "P2002") {
                throw new ConflictException(
                    `User has already voted for techId:${teamTechId}`,
                );
            }
            throw e;
        }
    }

    async removeVote(req, teamId, teamTechId) {
        const voyageMemberId = await this.findVoyageMemberId(req, teamId);
        if (!voyageMemberId) throw new BadRequestException("Invalid User");

        try {
            const deletedVote = await this.prisma.teamTechStackItemVote.delete({
                where: {
                    userTeamStackVote: {
                        teamTechId,
                        teamMemberId: voyageMemberId,
                    },
                },
            });

            // check if it was the last vote, if so, also delete the team tech item entry
            const teamTechItem = await this.prisma.teamTechStackItem.findUnique(
                {
                    where: {
                        id: teamTechId,
                    },
                    select: {
                        teamTechStackItemVotes: true,
                    },
                },
            );

            if (teamTechItem.teamTechStackItemVotes.length === 0) {
                return this.prisma.teamTechStackItem.delete({
                    where: {
                        id: teamTechId,
                    },
                });
            } else {
                return deletedVote;
            }
        } catch (e) {
            if (e.code === "P2025") {
                throw new NotFoundException(e.meta.cause);
            }
            throw e;
        }
    }
}
