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

    // TODO: maybe move to global, as this could be used by other endpoints
    // parse sort strings into format usable by prisma
    // sort string is in the from of "-createdAt;+status"
    // - for descending, + (or nothing) for ascending
    // valid sort fields are: 'status', 'createdAt', 'updatedAt'
    // TODO: create a map of valid sort fields for different tables, and map things like status -> statusId
    private parseSortString = (sortString: string) => {
        return sortString.split(";").map((field) => {
            const direction = field[0] === "-" ? "desc" : "asc";
            const fieldName =
                field.charAt(0) === "+" || field.charAt(0) === "-"
                    ? field.slice(1)
                    : field;
            return {
                [fieldName]: direction,
            };
        });
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
        this.parseSortString(sort);
        const soloProjects = await this.prisma.soloProject.findMany({
            skip: offset,
            take: pageSize,
            // orderBy: this.parseSortString(sort),
            orderBy: {
                statusId: "desc",
            },
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
