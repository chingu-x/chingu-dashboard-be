import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";

// const USER_ID = "bf24212d-403f-4459-aa76-d9abc701a3bf";

@Injectable()
export class IdeationService {
    constructor(private prisma: PrismaService) {}
    // create(createIdeationDto: CreateIdeationDto) {
    //     return "This action adds a new ideation";
    // }

    async findAll() {
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

    update(id: number, updateIdeationDto: UpdateIdeationDto) {
        return this.prisma.projectIdea.update({
            where: {
                id: id,
            },
            data: updateIdeationDto,
        });
    }

    remove(id: number) {
        const deleteIdeation = this.prisma.projectIdea.delete({
            where: {
                id: id,
            },
        });
        return deleteIdeation;
    }
}
