import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateFeatureDto } from "./dto/create-feature.dto";
import { UpdateFeatureDto } from "./dto/update-feature.dto";
import { UpdateFeatureOrderAndCategoryDto } from "./dto/update-feature-order-and-category.dto";
import { GlobalService } from "@/global/global.service";
import { CustomRequest } from "@/global/types/CustomRequest";
import { manageOwnVoyageTeamWithIdParam } from "@/ability/conditions/voyage-teams.ability";
import { manageOwnFeaturesById } from "@/ability/conditions/features.ability";

@Injectable()
export class FeaturesService {
    constructor(
        private prisma: PrismaService,
        private readonly globalService: GlobalService,
    ) {}

    async checkTeamId(teamId: number) {
        const team = await this.prisma.voyageTeam.findFirst({
            where: {
                id: teamId,
            },
            select: {
                id: true,
            },
        });

        if (!team) {
            throw new BadRequestException("invalid Team Id");
        }
    }

    async createFeature(
        req: CustomRequest,
        teamId: number,
        createFeatureDto: CreateFeatureDto,
    ) {
        //check for valid team id
        await this.checkTeamId(teamId);

        //owm team permissions
        manageOwnVoyageTeamWithIdParam(req.user, teamId);
        const { featureCategoryId, description } = createFeatureDto;

        const validCategory = await this.prisma.featureCategory.findFirst({
            where: {
                id: featureCategoryId,
            },
            select: {
                id: true,
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

            const newOrder =
                lastFeature && lastFeature?.order ? lastFeature.order! + 1 : 1;

            const newFeature = await this.prisma.projectFeature.create({
                data: {
                    teamMemberId: this.globalService.getVoyageTeamMemberId(
                        req,
                        teamId,
                    ),
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

    async findAllFeatures(teamId: number, req: CustomRequest) {
        try {
            //check for valid teamId
            await this.checkTeamId(teamId);

            //check for team permissions
            manageOwnVoyageTeamWithIdParam(req.user, teamId);

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

            return allTeamFeatures;
        } catch (e) {
            throw e;
        }
    }

    async findOneFeature(featureId: number, req: CustomRequest) {
        try {
            await manageOwnFeaturesById(req.user, featureId);
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

            return projectFeature;
        } catch (e) {
            throw e;
        }
    }

    async updateFeature(
        featureId: number,
        updateFeatureDto: UpdateFeatureDto,
        req: CustomRequest,
    ) {
        try {
            await manageOwnFeaturesById(req.user, featureId);

            const { teamMemberId, description } = updateFeatureDto;

            //check for valid teamMemberId in dto
            const isValidTeamMember = req.user.voyageTeams
                .map((vt) => vt.memberId)
                .includes(teamMemberId);
            if (!isValidTeamMember) {
                throw new BadRequestException(
                    `TeamMemberId (id: ${teamMemberId}) is invalid.`,
                );
            }

            const updatedFeature = await this.prisma.projectFeature.update({
                where: {
                    id: featureId,
                    teamMemberId: teamMemberId,
                },
                data: {
                    teamMemberId,
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

    async updateFeatureOrderAndCategory(
        req: CustomRequest,
        featureId: number,
        updateOrderAndCategoryDto: UpdateFeatureOrderAndCategoryDto,
    ) {
        try {
            const { order, featureCategoryId: newFeatureCategoryId } =
                updateOrderAndCategoryDto;

            const currFeature = await this.findFeature(featureId);

            //check if the user is part of the team that owns the feature
            if (
                !req.user.voyageTeams.some(
                    (vt) => vt.teamId === currFeature.addedBy?.voyageTeamId,
                )
            ) {
                throw new ForbiddenException(
                    "Forbidden: Not a part of the team that owns this Project feature",
                );
            }

            const teamId = currFeature.addedBy!.voyageTeamId!;

            const verifyCategoryExists =
                await this.prisma.featureCategory.findFirst({
                    where: {
                        id: newFeatureCategoryId,
                    },
                    select: {
                        id: true,
                    },
                });

            if (!verifyCategoryExists) {
                throw new BadRequestException(
                    `CategoryId (id: ${newFeatureCategoryId}) is invalid.`,
                );
            }

            const existingCategoryFeatures =
                await this.prisma.projectFeature.findMany({
                    where: {
                        featureCategoryId: currFeature.featureCategoryId,
                        addedBy: { voyageTeamId: teamId },
                    },
                });
            if (
                order &&
                newFeatureCategoryId &&
                newFeatureCategoryId !== currFeature.featureCategoryId
            ) {
                const newCategoryFeatures =
                    await this.prisma.projectFeature.findMany({
                        where: {
                            featureCategoryId: newFeatureCategoryId,
                            addedBy: { voyageTeamId: teamId },
                        },
                    });
                const existingFeaturesToUpdate =
                    existingCategoryFeatures.filter(
                        (feature) =>
                            feature.id !== featureId &&
                            feature.order! > currFeature.order!,
                    );
                const newFeaturesToUpdate = newCategoryFeatures.filter(
                    (feature) => feature.order! >= order,
                );
                await Promise.all(
                    existingFeaturesToUpdate.map(async (feature) => {
                        await this.prisma.projectFeature.update({
                            where: { id: feature.id },
                            data: {
                                order: feature.order! - 1,
                            },
                        });
                    }),
                );
                await Promise.all(
                    newFeaturesToUpdate.map(async (feature) => {
                        await this.prisma.projectFeature.update({
                            where: { id: feature.id },
                            data: {
                                order: feature.order! + 1,
                            },
                        });
                    }),
                );
                await this.prisma.projectFeature.update({
                    where: { id: featureId },
                    data: {
                        featureCategoryId: newFeatureCategoryId,
                        order: order,
                    },
                });
            } else {
                if (order < currFeature.order!) {
                    const existingFeaturesToUpdate =
                        existingCategoryFeatures.filter(
                            (feature) =>
                                feature.id !== featureId &&
                                feature.order! >= order &&
                                feature.order! < currFeature.order!,
                        );

                    await Promise.all(
                        existingFeaturesToUpdate.map(async (feature) => {
                            await this.prisma.projectFeature.update({
                                where: { id: feature.id },
                                data: {
                                    order: feature.order! + 1,
                                },
                            });
                        }),
                    );
                } else {
                    const existingFeaturesToUpdate =
                        existingCategoryFeatures.filter(
                            (feature) =>
                                feature.id !== featureId &&
                                feature.order! <= order &&
                                feature.order! > currFeature.order!,
                        );
                    await Promise.all(
                        existingFeaturesToUpdate.map(async (feature) => {
                            await this.prisma.projectFeature.update({
                                where: { id: feature.id },
                                data: {
                                    order: feature.order! - 1,
                                },
                            });
                        }),
                    );
                }
                await this.prisma.projectFeature.update({
                    where: { id: featureId },
                    data: {
                        order: order,
                    },
                });
            }
            const newCategoryFeaturesList = await this.findAllFeatures(
                teamId,
                req,
            );
            return newCategoryFeaturesList;
        } catch (e) {
            throw e;
        }
    }

    async deleteFeature(featureId: number, req: CustomRequest) {
        try {
            await manageOwnFeaturesById(req.user, featureId);
            const currFeature = await this.findFeature(featureId);

            const voyageTeamMember =
                await this.prisma.voyageTeamMember.findFirst({
                    where: { id: currFeature.teamMemberId! },
                    select: { voyageTeamId: true },
                });

            const teamId = voyageTeamMember?.voyageTeamId;
            const existingCategoryFeatures =
                await this.prisma.projectFeature.findMany({
                    where: {
                        featureCategoryId: currFeature.featureCategoryId,
                        addedBy: { voyageTeamId: teamId },
                    },
                });
            const existingFeaturesToUpdate = existingCategoryFeatures.filter(
                (feature) =>
                    feature.id !== featureId &&
                    currFeature.order! < feature.order!,
            );
            await Promise.all(
                existingFeaturesToUpdate.map(async (feature) => {
                    await this.prisma.projectFeature.update({
                        where: { id: feature.id },
                        data: {
                            order: feature.order! - 1,
                        },
                    });
                }),
            );
            const deletedFeature = await this.prisma.projectFeature.delete({
                where: {
                    id: featureId,
                },
            });
            if (!deletedFeature) {
                throw new NotFoundException(
                    `FeatureId (id: ${featureId}) does not exist.`,
                );
            } else {
                return {
                    message: "Feature deleted successfully",
                    status: 200,
                };
            }
        } catch (e) {
            throw e;
        }
    }

    private async findFeature(featureId: number) {
        const feature = await this.prisma.projectFeature.findUnique({
            where: { id: featureId },
            include: {
                addedBy: {
                    select: {
                        voyageTeamId: true,
                    },
                },
            },
        });

        if (!feature) {
            throw new NotFoundException(
                `Feature with ID ${featureId} not found.`,
            );
        }

        return feature;
    }
}
