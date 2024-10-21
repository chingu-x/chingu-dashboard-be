import { Injectable } from "@nestjs/common";
import { CreateSoloProjectDto } from "./dto/create-solo-project.dto";
import { UpdateSoloProjectDto } from "./dto/update-solo-project.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { Prisma, User } from "@prisma/client";

@Injectable()
export class SoloProjectsService {
    constructor(private prisma: PrismaService) {}
    create(createSoloProjectDto: CreateSoloProjectDto) {
        return "This action adds a new soloProject";
    }

    // TODO add to shared
    private formatUser = (
        userSelect: Prisma.UserGetPayload<{
            include: {
                oAuthProfiles: {
                    select: {
                        provider: true;
                        providerId: true;
                        providerUsername: true;
                    };
                };
            };
        }>,
    ) => {
        return {
            name: `${userSelect.firstName} ${userSelect.lastName}`,
            email: userSelect.email,
            discordId: userSelect.oAuthProfiles.find(
                (profile) => profile.provider.name === "discord",
            )?.providerUsername,
        };
    };

    getAllSoloProjects() {
        return this.prisma.soloProject.findMany({
            select: {
                id: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                evaluator: {
                    select: {
                        firstName: true,
                        lastName: true,
                        oAuthProfiles: true,
                    },
                },
                evaluatorFeedback: true,
                status: {
                    select: {
                        status: true,
                    },
                },
                createdAt: true,
            },
        });
    }

    findOne(id: number) {
        return `This action returns a #${id} soloProject`;
    }

    update(id: number, updateSoloProjectDto: UpdateSoloProjectDto) {
        return `This action updates a #${id} soloProject`;
    }

    remove(id: number) {
        return `This action removes a #${id} soloProject`;
    }
}
