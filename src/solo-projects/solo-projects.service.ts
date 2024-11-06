import { Injectable } from "@nestjs/common";
import { CreateSoloProjectDto } from "./dto/create-solo-project.dto";
import { UpdateSoloProjectDto } from "./dto/update-solo-project.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { userSelectBasicWithSocial } from "@/global/selects/users.select";
import { SoloProjectWithPayload } from "@/global/types/solo-project.types";
import { GlobalService } from "@/global/global.service";

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
        console.log(`solo-projects.service.ts (36): sort = ${sort}`);
        const soloProjects = await this.prisma.soloProject.findMany({
            skip: offset,
            take: pageSize,
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
                responseGroupId: true,
                createdAt: true,
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
