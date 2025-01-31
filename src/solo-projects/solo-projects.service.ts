import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { userSelectBasicWithSocial } from "@/global/selects/users.select";
import { SoloProjectWithPayload } from "@/global/types/solo-project.types";
import { GlobalService } from "@/global/global.service";
import { soloProjectSortMap } from "@/global/constants/sortMaps";
import { soloProjectStatuses } from "@/global/constants/statuses";

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
            status: soloProject.status?.status,
            comments: soloProject.comments,
            responses: this.globalService.formatResponses(
                soloProject.responseGroup?.responses,
            ),
            createdAt: soloProject.createdAt,
            updatedAt: soloProject.updatedAt,
        };
    };

    async getAllSoloProjects({
        offset,
        pageSize,
        sort,
        status,
        voyageRoles,
    }: {
        offset: number;
        pageSize: number;
        sort: string;
        status: (typeof soloProjectStatuses)[number] | undefined;
        voyageRoles: string | undefined;
    }) {
        console.log(`solo-projects.service.ts (48): status = ${status}`);
        console.log(
            `solo-projects.service.ts (49): voyageRoles = ${voyageRoles}`,
        );
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
                        parentCommentId: true,
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
                updatedAt: true,
            },
            where: {
                status: {
                    status,
                },
            },
        });

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
}
