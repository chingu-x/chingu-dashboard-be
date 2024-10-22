import { Injectable } from "@nestjs/common";
import { CreateSoloProjectDto } from "./dto/create-solo-project.dto";
import { UpdateSoloProjectDto } from "./dto/update-solo-project.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { Prisma } from "@prisma/client";

// TODO: add to shared
type UserWithProfile = Prisma.UserGetPayload<{
    include: {
        oAuthProfiles: {
            select: {
                provider: true;
                providerId: true;
                providerUsername: true;
            };
        };
    };
}>;

type SoloProjectWithPayload = Prisma.SoloProjectGetPayload<{
    include: {
        user: {
            include: {
                oAuthProfiles: {
                    select: {
                        provider: true;
                        providerId: true;
                        providerUsername: true;
                    };
                };
            };
        };
        evaluator: {
            include: {
                oAuthProfiles: {
                    select: {
                        provider: true;
                        providerId: true;
                        providerUsername: true;
                    };
                };
            };
        };
    };
}>;

@Injectable()
export class SoloProjectsService {
    constructor(private prisma: PrismaService) {}

    create(_createSoloProjectDto: CreateSoloProjectDto) {
        return "This action adds a new soloProject";
    }

    // TODO: add to shared
    private formatUser = (user: UserWithProfile) => {
        return {
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email,
            discordId: user.oAuthProfiles?.find(
                (profile) => profile.provider.name === "discord",
            )?.providerUsername,
        };
    };

    private formatSoloProject = (soloProject: SoloProjectWithPayload) => {
        return {
            id: soloProject.id,
            user: this.formatUser(soloProject.user),
            evaluator:
                soloProject.evaluator && this.formatUser(soloProject.evaluator),
        };
    };

    async getAllSoloProjects() {
        const soloProjects = await this.prisma.soloProject.findMany({
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
                        oAuthProfiles: {
                            select: {
                                provider: true,
                                providerId: true,
                                providerUsername: true,
                            },
                        },
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

        return soloProjects.map((sp) => ({
            // ...sp,
            user: this.formatUser(sp.user as UserWithProfile),
            evaluator:
                sp.evaluator &&
                this.formatUser(sp.evaluator as UserWithProfile),
        }));
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
