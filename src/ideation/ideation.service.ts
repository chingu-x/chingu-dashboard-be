import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
// import { CreateIdeationDto } from "./dto/create-ideation.dto";
// import { UpdateIdeationDto } from "./dto/update-ideation.dto";

// const USER_ID = "bf24212d-403f-4459-aa76-d9abc701a3bf";

@Injectable()
export class IdeationService {
    constructor(private prisma: PrismaService) {}
    // create(createIdeationDto: CreateIdeationDto) {
    //     return "This action adds a new ideation";
    // }

    // findAll() {
    //     return "This action returns all ideation";
    // }

    async getProjectIdeas(id: number) {
        const query = await this.prisma.voyageTeamMember.findMany({
            where: {
                voyageTeamId: id,
            },
            include: {
                projectIdeas: {
                    include: {
                        contributedBy: {
                            include: {
                                member: true,
                            },
                        },
                    },
                },
            },
        });

        console.log(query);

        return query;
    }

    // update(id: number, updateIdeationDto: UpdateIdeationDto) {
    //     return `This action updates a #${id} ideation`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} ideation`;
    // }
}
