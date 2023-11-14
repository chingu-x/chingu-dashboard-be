import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateFeatureDto } from "./dto/create-feature.dto";
import { UpdateFeatureDto } from "./dto/update-feature.dto";
import { GlobalService } from "src/global/global.service";

@Injectable()
export class FeaturesService {
    constructor(
        private prisma: PrismaService,
        private readonly globalService: GlobalService,
    ) {}

    async createFeature(
        req,
        teamId: number,
        createFeatureDto: CreateFeatureDto,
    ) {
        const { featureCategoryId, description } = createFeatureDto;

        const teamMember =
            await this.globalService.validateLoggedInAndTeamMember(
                teamId,
                req.user.userId,
            );

        const validCategory = await this.prisma.featureCategory.findFirst({
            where: {
                id: featureCategoryId,
            },
        });

        if (!validCategory) {
            throw new NotFoundException(
                `FeatureCategoryId (id: ${featureCategoryId}) does not exist.`,
            );
        }

        try {
            const newFeature = await this.prisma.projectFeature.create({
                data: {
                    teamMemberId: teamMember.id,
                    featureCategoryId,
                    description,
                },
            });
            return newFeature;
        } catch (e) {
            throw e;
        }
    }

    async findFeatureCategories() {
        try {
            const featureCategories =
                await this.prisma.featureCategory.findMany();
            return featureCategories;
        } catch (e) {
            throw e;
        }
    }

    async findOneFeature(featureId: number) {
        try {
            const projectFeature = await this.prisma.projectFeature.findFirst({
                where: {
                    id: featureId,
                },
                select: {
                    id: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                    teamMemberId: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    addedBy: {
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
                },
            });

            if (!projectFeature) {
                throw new NotFoundException(
                    `FeatureId (id: ${featureId}) does not exist.`,
                );
            }

            return projectFeature;
        } catch (e) {
            throw e;
        }
    }

    async findAllFeatures(teamId: number) {
        try {
            const allTeamFeatures = await this.prisma.projectFeature.findMany({
                where: {
                    addedBy: {
                        voyageTeamId: teamId,
                    },
                },
                select: {
                    id: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                    teamMemberId: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    addedBy: {
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
                },
            });

            if (!allTeamFeatures) {
                throw new NotFoundException(
                    `TeamId (id: ${teamId}) does not exist.`,
                );
            }

            return allTeamFeatures;
        } catch (e) {
            throw e;
        }
    }

    async updateFeature(featureId: number, updateFeatureDto: UpdateFeatureDto) {
        const { teamMemberId, featureCategoryId, description } =
            updateFeatureDto;

        try {
            const updatedFeature = await this.prisma.projectFeature.update({
                where: {
                    id: featureId,
                    teamMemberId: teamMemberId,
                },
                data: {
                    teamMemberId,
                    featureCategoryId,
                    description,
                },
            });

            if (!updatedFeature) {
                throw new BadRequestException(
                    `Req.body or featureId (id: ${featureId}) is invalid. Body: ${updateFeatureDto}.`,
                );
            }

            return updatedFeature;
        } catch (e) {
            throw e;
        }
    }

    async deleteFeature(featureId: number) {
        try {
            const deletedFeature = await this.prisma.projectFeature.delete({
                where: {
                    id: featureId,
                },
            });

            if (!deletedFeature) {
                throw new NotFoundException(
                    `FeatureId (id: ${featureId}) does not exist.`,
                );
            }
        } catch (e) {
            throw e;
        }
    }
}
