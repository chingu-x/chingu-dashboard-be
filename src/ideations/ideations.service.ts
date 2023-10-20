import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";

//const USER_ID = "bf24212d-403f-4459-aa76-d9abc701a3bf";
//const UserId = 10;

@Injectable()
export class IdeationsService {
    constructor(private prisma: PrismaService) {}
    async create(createIdeationDto: CreateIdeationDto) {
        const { userId, title, description, vision } = createIdeationDto;

        const createdIdeation = await this.prisma.projectIdea.create({
            //TODO change userID input to be userid: uuid once authentication done
            data: {
                userId,
                title,
                description,
                vision,
            },
        });
        return createdIdeation;
    }

    async findAll(id: number) {
        return this.prisma.projectIdea.findMany({});
    }

    async getProjectIdeas(id: number) {
        const query = await this.prisma.voyageTeamMember.findMany({
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
                                    include: {
                                        member: {
                                            select: {
                                                id: true,
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

        return query.map((q) => Object.values(q).flat()).flat();
    }

    async update(
        id: number,
        pId: number,
        updateIdeationDto: UpdateIdeationDto,
    ) {
        return this.prisma.projectIdea.update({
            where: {
                id: pId,
            },
            data: updateIdeationDto,
        });
    }

    async remove(id: number, pId: number) {
        const deleteIdeation = this.prisma.projectIdea.delete({
            where: {
                id: pId,
            },
        });
        return deleteIdeation;
    }

    /*async voteForProjectIdea(userId: number, projectIdeaId: number) {
        const createVote = await this.prisma.projectIdeaVotes.create({
            data: {
                userId,

                projectIdeaId,
            },
        });
        return createVote;
    }*/
}
