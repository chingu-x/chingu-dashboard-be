import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFeatureDto } from "./dto/create-feature.dto";
import { UpdateFeatureDto } from "./dto/update-feature.dto";
import { UpdateFeatureOrderDto } from "./dto/update-feature-order.dto";
import { GlobalService } from "../global/global.service";

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
            const lastFeature = await this.prisma.projectFeature.findFirst({
                where: {
                    featureCategoryId,
                    addedBy: {
                        voyageTeamId: teamId,
                    },
                },
                orderBy: {
                    order: "desc",
                },
            });

            const newOrder = lastFeature ? lastFeature.order + 1 : 1;

            const newFeature = await this.prisma.projectFeature.create({
                data: {
                    teamMemberId: teamMember.id,
                    featureCategoryId,
                    description,
                    order: newOrder,
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
                    order: true,
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
                    order: true,
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
                orderBy: [{ category: { id: "asc" } }, { order: "asc" }],
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

    async updateFeatureOrder(
        req,
        featureId: number,
        updateOrderDto: UpdateFeatureOrderDto,
    ) {
        const { order } = updateOrderDto;

        const currFeature = await this.prisma.projectFeature.findUnique({
            where: { id: featureId },
        });

        if (!currFeature) {
            throw new NotFoundException(
                `Feature with ID ${featureId} not found.`,
            );
        }

        const featureVoyageTeamMember =
            await this.prisma.voyageTeamMember.findFirst({
                where: { id: currFeature.teamMemberId },
                select: { voyageTeamId: true },
            });

        const currentUserVoyageTeamMember =
            await this.prisma.voyageTeamMember.findFirst({
                where: { userId: req.user.userId },
                select: { voyageTeamId: true },
            });

        if (!currentUserVoyageTeamMember) {
            throw new BadRequestException(
                `User with ID ${req.user.userId} is not a member of a team.`,
            );
        }

        if (
            featureVoyageTeamMember.voyageTeamId !==
            currentUserVoyageTeamMember.voyageTeamId
        ) {
            throw new BadRequestException(
                `Feature with ID ${featureId} does not belong to the team with ID ${currentUserVoyageTeamMember.voyageTeamId}.`,
            );
        }

        const categoryFeatures = await this.prisma.projectFeature.findMany({
            where: {
                featureCategoryId: currFeature.featureCategoryId,
                addedBy: { voyageTeamId: featureVoyageTeamMember.voyageTeamId },
            },
        });

        const featuresToUpdate = categoryFeatures.filter(
            (feature) => feature.id !== featureId,
        );

        currFeature.order > order
            ? await Promise.all(
                  featuresToUpdate.map((feature) =>
                      this.prisma.projectFeature.update({
                          where: { id: feature.id },
                          data: {
                              order:
                                  feature.order >= order &&
                                  feature.order < currFeature.order
                                      ? feature.order + 1
                                      : feature.order,
                          },
                      }),
                  ),
              )
            : await Promise.all(
                  featuresToUpdate.map((feature) =>
                      this.prisma.projectFeature.update({
                          where: { id: feature.id },
                          data: {
                              order:
                                  feature.order <= order &&
                                  feature.order > currFeature.order
                                      ? feature.order - 1
                                      : feature.order,
                          },
                      }),
                  ),
              );

        await this.prisma.projectFeature.update({
            where: { id: featureId },
            data: { order: order },
        });

        return {
            ...currFeature,
            order: order,
        };
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
