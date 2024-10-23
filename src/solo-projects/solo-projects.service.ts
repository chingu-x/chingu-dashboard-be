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

    create(_createSoloProjectDto: CreateSoloProjectDto) {
        return "This action adds a new soloProject";
    }

    // TODO: add to shared

    private formatSoloProject = (soloProject: SoloProjectWithPayload) => {
        return {
            id: soloProject.id,
            user: this.globalService.formatUser(soloProject.user),
            evaluator:
                soloProject.evaluator &&
                this.globalService.formatUser(soloProject.evaluator),
            //evaluatorFeedback: soloProject.evaluatorFeedback,
            submissionTimestamp: soloProject.createdAt,
            status: soloProject.status?.status,
            comments: soloProject.comments,
        };
    };

    async getAllSoloProjects() {
        const soloProjects = await this.prisma.soloProject.findMany({
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

        return soloProjects.map((sp) =>
            this.formatSoloProject(sp as unknown as SoloProjectWithPayload),
        );
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
