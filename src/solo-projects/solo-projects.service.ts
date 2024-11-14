import { Injectable } from "@nestjs/common";
import { CreateSoloProjectDto } from "./dto/create-solo-project.dto";
import { UpdateSoloProjectDto } from "./dto/update-solo-project.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { userSelectBasicWithSocial } from "@/global/selects/users.select";
import { SoloProjectWithPayload } from "@/global/types/solo-project.types";
import { GlobalService } from "@/global/global.service";
import { soloProjectSortMap } from "@/global/constants/sortMaps";

@Injectable()
export class SoloProjectsService {
    constructor(
        private prisma: PrismaService,
        private globalService: GlobalService,
    ) {}

    private formatSoloProject = (soloProject: SoloProjectWithPayload) => {
        return {
            id: soloProject.id,
            user: this.globalService.formatUser(soloProject.user),
            evaluator:
                soloProject.evaluator &&
                this.globalService.formatUser(soloProject.evaluator),
            // TODO: uncomment below, commented out so results are easier to see
            // evaluatorFeedback: soloProject.evaluatorFeedback,
            submissionTimestamp: soloProject.createdAt,
            status: soloProject.status?.status,
            comments: soloProject.comments,
            responses: this.globalService.formatResponses(
                soloProject.responseGroup?.responses,
            ),
        };
    };

    create(_createSoloProjectDto: CreateSoloProjectDto) {
        return "This action adds a new soloProject";
    }

    async getAllSoloProjects(
        offset: number,
        pageSize: number,
        sort: string = "-createdAt",
    ) {
        const soloProjects = await this.prisma.soloProject.findMany({
            skip: offset,
            take: pageSize,
            orderBy: this.globalService.parseSortString(
                sort,
                soloProjectSortMap,
            ),
            select: {
                id: true,
                user: {
                    select: userSelectBasicWithSocial,
                },
                evaluator: {
                    select: userSelectBasicWithSocial,
                },
                evaluatorFeedback: true,
                status: {
                    select: {
                        status: true,
                    },
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        author: {
                            select: userSelectBasicWithSocial,
                        },
                    },
                },
                responseGroup: {
                    select: {
                        responses: {
                            select: {
                                question: {
                                    select: {
                                        text: true,
                                        inputType: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                                numeric: true,
                                text: true,
                                boolean: true,
                                optionChoice: {
                                    select: {
                                        text: true,
                                    },
                                },
                            },
                        },
                    },
                },
                createdAt: true,
            },
        });

        // console.log(soloProjects);

        const data = soloProjects.map((sp) =>
            this.formatSoloProject(sp as unknown as SoloProjectWithPayload),
        );

        return {
            data,
            meta: {
                pageSize,
                offset,
            },
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} soloProject`;
    }

    update(id: number, _updateSoloProjectDto: UpdateSoloProjectDto) {
        return `This action updates a #${id} soloProject`;
    }

    remove(id: number) {
        return `This action removes a #${id} soloProject`;
    }
}
