import { Test, TestingModule } from "@nestjs/testing";
import { FeaturesService } from "./features.service";
import { PrismaService } from "@/prisma/prisma.service";
import { GlobalService } from "@/global/global.service";
import { toBeArray } from "jest-extended";
import { prismaMock } from "@/prisma/singleton";
import { CustomRequest } from "@/global/types/CustomRequest";
import { CreateFeatureDto } from "./dto/create-feature.dto";
import * as FeaturesAbility from "@/ability/conditions/features.ability";
import { FeatureCategory, VoyageTeamMember } from "@prisma/client";
import { UpdateFeatureDto } from "./dto/update-feature.dto";
import { UpdateFeatureOrderAndCategoryDto } from "./dto/update-feature-order-and-category.dto";

expect.extend({ toBeArray });

const userReq = {
    userId: "aa9d050e-5756-4c3c-bc04-071f39f53663",
    email: "test@test.com",
    roles: ["voyager"],
    isVerified: true,
    voyageTeams: [{ teamId: 1, memberId: 1 }],
};
const requestMock = {
    user: userReq,
} as any as CustomRequest;

const mockDate = new Date("2024-11-05T02:41:03.575Z");

const mockFeature = {
    id: 1,
    teamMemberId: 1,
    createdAt: mockDate,
    updatedAt: mockDate,
    featureCategoryId: 2,
    order: 1,
    description: "It is a very good feature that is very useful for the team",
};

const mockTeamId: number = 1;
const mockTeamMemberId: number = 1;

const mockGlobalService = {
    getVoyageTeamMemberId: jest.fn(),
};

const mockFeaturesArray = [
    {
        id: 1,
        teamMemberId: 1,
        createdAt: mockDate,
        updatedAt: mockDate,
        featureCategoryId: 2,
        order: 1,
        description:
            "It is a very good feature that is very useful for the team",
        addedBy: {
            member: {
                firstName: "Larry",
                lastName: "Castro",
                id: "18093ad0-88ef-4bcd-bee8-322749c876bd",
                avatar: "https://gravatar.com/avatar/90383a4ee0fb891c1ec3374e6a593a6c6fd88166d4fd45f796dabeaba7af836d?s=200&r=g&d=wavatar\n",
            },
        },
    },
    {
        id: 2,
        teamMemberId: 2,
        createdAt: mockDate,
        updatedAt: mockDate,
        featureCategoryId: 2,
        order: 2,
        description:
            "It is a very good feature that is very useful for the team",
        addedBy: {
            member: {
                firstName: "Larry",
                lastName: "Castro",
                id: "18093ad0-88ef-4bcd-bee8-322749c876bd",
                avatar: "https://gravatar.com/avatar/90383a4ee0fb891c1ec3374e6a593a6c6fd88166d4fd45f796dabeaba7af836d?s=200&r=g&d=wavatar\n",
            },
        },
    },
];

const mockFeatureCategory = [
    {
        name: "must have",
        id: 1,
        description: "features that define your MVP",
        createdAt: mockDate,
        updatedAt: mockDate,
    },
    {
        name: "should have",
        id: 2,
        description:
            '"stretch goals" to be worked on when you’ve implemented all the "Must Haves"',
        createdAt: mockDate,
        updatedAt: mockDate,
    },
    {
        name: "nice to have",
        id: 3,
        description:
            '"stretch goals" to be worked on when you’ve implemented all the "Must Haves" and "Should Haves"',
        createdAt: mockDate,
        updatedAt: mockDate,
    },
];

describe("FeaturesService", () => {
    let service: FeaturesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FeaturesService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
                {
                    provide: GlobalService,
                    useValue: mockGlobalService,
                },
            ],
        }).compile();

        service = module.get<FeaturesService>(FeaturesService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("createFeature", () => {
        it("createFeature service should be defined", async () => {
            expect(service.createFeature).toBeDefined();
        });

        it("should create a new feature", async () => {
            const mockFeatureCategoryId: number = 1;
            const dtoCreateMock: CreateFeatureDto = {
                description: "Chingu is a global collaboration platform",
                featureCategoryId: 1,
            };

            const checkTeamIdSpy = jest
                .spyOn(service, "checkTeamId")
                .mockResolvedValue();
            prismaMock.featureCategory.findFirst.mockResolvedValue({
                id: mockFeatureCategoryId,
            } as FeatureCategory);

            prismaMock.projectFeature.findFirst.mockResolvedValue(null);
            prismaMock.projectFeature.create.mockResolvedValue(mockFeature);

            mockGlobalService.getVoyageTeamMemberId.mockReturnValue(
                mockTeamMemberId,
            );

            const result = await service.createFeature(
                requestMock,
                mockTeamId,
                dtoCreateMock,
            );

            expect(result).toEqual(mockFeature);
            expect(prismaMock.projectFeature.create).toHaveBeenCalledWith({
                data: {
                    teamMemberId: mockTeamMemberId,
                    description: dtoCreateMock.description,
                    featureCategoryId: dtoCreateMock.featureCategoryId,
                    order: 1,
                },
            });
            expect(prismaMock.featureCategory.findFirst).toHaveBeenCalledWith({
                where: {
                    id: dtoCreateMock.featureCategoryId,
                },
                select: {
                    id: true,
                },
            });
            expect(prismaMock.projectFeature.findFirst).toHaveBeenCalledWith({
                where: {
                    featureCategoryId: dtoCreateMock.featureCategoryId,
                    addedBy: { voyageTeamId: mockTeamId },
                },
                orderBy: {
                    order: "desc",
                },
            });
            expect(checkTeamIdSpy).toHaveBeenCalledWith(mockTeamId);
        });
    });
    describe("findFeatureCategories", () => {
        it("findFeatureCategories service should be defined", async () => {
            expect(service.findFeatureCategories).toBeDefined();
        });

        it("should return all feature categories", async () => {
            prismaMock.featureCategory.findMany.mockResolvedValue(
                mockFeatureCategory,
            );

            const result = await service.findFeatureCategories();

            expect(result).toBeArray();
            expect(result).toHaveLength(3);
            expect(result[0]).toEqual({
                name: expect.any(String),
                id: expect.any(Number),
                description: expect.any(String),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
            expect(prismaMock.featureCategory.findMany).toHaveBeenCalled();
        });
    });

    describe("findAllFeatures", () => {
        it("findAllFeatures service should be defined", async () => {
            expect(service.findAllFeatures).toBeDefined();
        });

        it("should return all features", async () => {
            const checkTeamIdSpy = jest
                .spyOn(service, "checkTeamId")
                .mockResolvedValue();

            prismaMock.projectFeature.findMany.mockResolvedValue(
                mockFeaturesArray,
            );

            const result = await service.findAllFeatures(
                mockTeamId,
                requestMock,
            );

            expect(result).toBeArray();
            expect(result).toHaveLength(2);
            expect(result).toEqual(mockFeaturesArray);
            expect(prismaMock.projectFeature.findMany).toHaveBeenCalledWith({
                where: {
                    addedBy: {
                        voyageTeamId: mockTeamId,
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
            expect(checkTeamIdSpy).toHaveBeenCalledWith(mockTeamId);
        });
    });
    describe("findOneFeature", () => {
        it("findOneFeature service should be defined", async () => {
            expect(service.findOneFeature).toBeDefined();
        });

        it("should return a single feature", async () => {
            const manageOwnFeaturesByIdSpy = jest
                .spyOn(FeaturesAbility, "manageOwnFeaturesById")
                .mockResolvedValue();
            prismaMock.projectFeature.findFirst.mockResolvedValue(
                mockFeaturesArray[0],
            );
            const result = await service.findOneFeature(
                mockFeaturesArray[0].id,
                requestMock,
            );

            expect(result).toEqual(mockFeaturesArray[0]);
            expect(prismaMock.projectFeature.findFirst).toHaveBeenCalledWith({
                where: {
                    id: mockFeature.id,
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
            expect(manageOwnFeaturesByIdSpy).toHaveBeenCalledWith(
                requestMock.user,
                mockFeature.id,
            );
        });
    });
    describe("updateFeature", () => {
        it("updateFeature service should be defined", async () => {
            expect(service.updateFeature).toBeDefined();
        });

        it("should update a feature", async () => {
            const dtoUpdateMock: UpdateFeatureDto = {
                teamMemberId: 1,
                description: "It is the best feature",
            };

            const mockUpdatedFeature = {
                ...mockFeature,
                description: "It is the best feature",
            };
            const manageOwnFeaturesByIdSpy = jest
                .spyOn(FeaturesAbility, "manageOwnFeaturesById")
                .mockResolvedValue();
            prismaMock.projectFeature.update.mockResolvedValue(
                mockUpdatedFeature,
            );

            const result = await service.updateFeature(
                mockUpdatedFeature.id,
                dtoUpdateMock,
                requestMock,
            );

            expect(result).toEqual({
                id: expect.any(Number),
                teamMemberId: expect.any(Number),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                featureCategoryId: expect.any(Number),
                order: expect.any(Number),
                description: expect.any(String),
            });
            expect(prismaMock.projectFeature.update).toHaveBeenCalledWith({
                where: {
                    id: mockUpdatedFeature.id,
                    teamMemberId: mockTeamMemberId,
                },
                data: {
                    description: dtoUpdateMock.description,
                    teamMemberId: mockTeamMemberId,
                },
            });
            expect(manageOwnFeaturesByIdSpy).toHaveBeenCalledWith(
                requestMock.user,
                mockUpdatedFeature.id,
            );
        });
    });

    describe("deleteFeature", () => {
        it("deleteFeature service should be defined", async () => {
            expect(service.deleteFeature).toBeDefined();
        });

        it("should delete a feature", async () => {
            const mockVoyageTeamMember = {
                voyageTeamId: mockTeamId,
            } as VoyageTeamMember;

            const findFeatureSpy = jest
                .spyOn(service as any, "findFeature")
                .mockResolvedValue({
                    ...mockFeature,
                    addedBy: {
                        voyageTeamId: 1,
                    },
                });
            const manageOwnFeaturesByIdSpy = jest
                .spyOn(FeaturesAbility, "manageOwnFeaturesById")
                .mockResolvedValue();
            prismaMock.voyageTeamMember.findFirst.mockResolvedValue(
                mockVoyageTeamMember,
            );
            prismaMock.projectFeature.findMany.mockResolvedValue(
                mockFeaturesArray,
            );
            prismaMock.projectFeature.update.mockResolvedValue({
                ...mockFeaturesArray[1],
                order: 1,
            });
            prismaMock.projectFeature.delete.mockResolvedValue(mockFeature);

            const result = await service.deleteFeature(
                mockFeature.id,
                requestMock,
            );

            expect(result).toEqual({
                message: expect.any(String),
                status: expect.any(Number),
            });
            expect(findFeatureSpy).toHaveBeenCalledWith(mockFeature.id);
            expect(prismaMock.voyageTeamMember.findFirst).toHaveBeenCalledWith({
                where: {
                    id: mockTeamMemberId,
                },
                select: {
                    voyageTeamId: true,
                },
            });

            expect(prismaMock.projectFeature.findMany).toHaveBeenCalledWith({
                where: {
                    featureCategoryId: mockFeature.featureCategoryId,
                    addedBy: { voyageTeamId: mockTeamId },
                },
            });
            expect(prismaMock.projectFeature.update).toHaveBeenCalledWith({
                where: { id: mockFeaturesArray[1].id },
                data: {
                    order: mockFeaturesArray[1].order - 1,
                },
            });
            expect(prismaMock.projectFeature.delete).toHaveBeenCalledWith({
                where: {
                    id: mockFeature.id,
                },
            });
            expect(manageOwnFeaturesByIdSpy).toHaveBeenCalledWith(
                requestMock.user,
                mockFeature.id,
            );
        });
    });

    describe("updateFeatureOrderAndCategory", () => {
        it("updateFeatureOrderAndCategory service should be defined", async () => {
            expect(service.updateFeatureOrderAndCategory).toBeDefined();
        });

        it("should update a feature to different feature category", async () => {
            const FeaturesArray = [
                {
                    id: 1,
                    teamMemberId: 1,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 1,
                    order: 1,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
                {
                    id: 2,
                    teamMemberId: 2,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 1,
                    order: 2,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
                {
                    id: 3,
                    teamMemberId: 2,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 2,
                    order: 1,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
                {
                    id: 4,
                    teamMemberId: 2,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 2,
                    order: 2,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
                {
                    id: 5,
                    teamMemberId: 2,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 2,
                    order: 3,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
            ];
            const dtoUpdateOrderAndCategoryMock: UpdateFeatureOrderAndCategoryDto =
                {
                    order: 2,
                    featureCategoryId: 2,
                };
            const resultMock = [
                {
                    ...FeaturesArray[1],
                    order: FeaturesArray[1].order - 1,
                },
                {
                    ...FeaturesArray[2],
                },
                {
                    ...FeaturesArray[0],
                    order: dtoUpdateOrderAndCategoryMock.order,
                    featureCategoryId:
                        dtoUpdateOrderAndCategoryMock.featureCategoryId,
                },
                {
                    ...FeaturesArray[3],
                    order: FeaturesArray[3].order + 1,
                },
                {
                    ...FeaturesArray[4],
                    order: FeaturesArray[4].order + 1,
                },
            ];

            const findAllFeaturesSpy = jest
                .spyOn(service, "findAllFeatures")
                .mockResolvedValue(resultMock as any);
            const mockFeatureCategory = { id: 2 } as FeatureCategory;

            const findFeatureSpy = jest
                .spyOn(service as any, "findFeature")
                .mockResolvedValue({
                    ...FeaturesArray[0],
                    addedBy: {
                        voyageTeamId: mockTeamId,
                    },
                });
            prismaMock.featureCategory.findFirst.mockResolvedValueOnce(
                mockFeatureCategory,
            );
            prismaMock.projectFeature.findMany
                .mockResolvedValueOnce([
                    { ...FeaturesArray[0] },
                    { ...FeaturesArray[1] },
                ])
                .mockResolvedValueOnce([
                    { ...FeaturesArray[2] },
                    { ...FeaturesArray[3] },
                    { ...FeaturesArray[4] },
                ]);
            prismaMock.projectFeature.update
                .mockResolvedValueOnce({
                    ...FeaturesArray[1],
                    order: FeaturesArray[1].order - 1,
                })
                .mockResolvedValueOnce({
                    ...FeaturesArray[3],
                    order: FeaturesArray[3].order + 1,
                })
                .mockResolvedValueOnce({
                    ...FeaturesArray[4],
                    order: FeaturesArray[4].order + 1,
                })
                .mockResolvedValueOnce({
                    ...FeaturesArray[0],
                    order: 2,
                    featureCategoryId: 2,
                });

            const result = await service.updateFeatureOrderAndCategory(
                requestMock,
                FeaturesArray[0].id,
                dtoUpdateOrderAndCategoryMock,
            );

            expect(result).toEqual(resultMock);

            expect(prismaMock.projectFeature.findMany).toHaveBeenCalledWith({
                where: {
                    featureCategoryId: mockFeature.featureCategoryId,
                    addedBy: { voyageTeamId: mockTeamId },
                },
            });
            expect(prismaMock.projectFeature.update).toHaveBeenCalledWith({
                where: { id: FeaturesArray[1].id },
                data: {
                    order: FeaturesArray[1].order - 1,
                },
            });
            expect(prismaMock.projectFeature.update).toHaveBeenCalledWith({
                where: { id: FeaturesArray[3].id },
                data: {
                    order: FeaturesArray[3].order + 1,
                },
            });
            expect(prismaMock.projectFeature.update).toHaveBeenCalledWith({
                where: { id: FeaturesArray[4].id },
                data: {
                    order: FeaturesArray[4].order + 1,
                },
            });
            expect(prismaMock.projectFeature.update).toHaveBeenCalledWith({
                where: { id: FeaturesArray[0].id },
                data: {
                    order: dtoUpdateOrderAndCategoryMock.order,
                    featureCategoryId:
                        dtoUpdateOrderAndCategoryMock.featureCategoryId,
                },
            });
            expect(findAllFeaturesSpy).toHaveBeenCalledWith(
                mockTeamId,
                requestMock,
            );
            expect(findFeatureSpy).toHaveBeenCalledWith(mockFeature.id);
        });
        it("should update a feature order in the same feature category having new order less than current order", async () => {
            const FeaturesArray = [
                {
                    id: 1,
                    teamMemberId: 1,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 1,
                    order: 1,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
                {
                    id: 2,
                    teamMemberId: 2,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 1,
                    order: 2,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
                {
                    id: 3,
                    teamMemberId: 2,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 1,
                    order: 3,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
                {
                    id: 4,
                    teamMemberId: 2,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 1,
                    order: 4,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
            ];
            const resultMock = [
                {
                    ...FeaturesArray[0],
                    order: 1,
                },
                {
                    ...FeaturesArray[2],
                    order: 2,
                },
                {
                    ...FeaturesArray[1],
                    order: 3,
                },
                {
                    ...FeaturesArray[3],
                    order: 4,
                },
            ];
            const dtoUpdateOrderAndCategoryMock: UpdateFeatureOrderAndCategoryDto =
                {
                    order: 2,
                    featureCategoryId: 1,
                };
            const mockFeatureCategory = { id: 1 } as FeatureCategory;

            const findFeatureSpy = jest
                .spyOn(service as any, "findFeature")
                .mockResolvedValue({
                    ...FeaturesArray[2],
                    addedBy: {
                        voyageTeamId: mockTeamId,
                    },
                });
            const findAllFeaturesSpy = jest
                .spyOn(service, "findAllFeatures")
                .mockResolvedValue(resultMock as any);
            prismaMock.featureCategory.findFirst.mockResolvedValueOnce(
                mockFeatureCategory,
            );
            prismaMock.projectFeature.findMany.mockResolvedValueOnce(
                FeaturesArray,
            );
            prismaMock.projectFeature.update
                .mockResolvedValueOnce({
                    ...FeaturesArray[1],
                    order: FeaturesArray[1].order + 1,
                })
                .mockResolvedValueOnce({
                    ...FeaturesArray[2],
                    order: FeaturesArray[2].order - 1,
                });
            const result = await service.updateFeatureOrderAndCategory(
                requestMock,
                FeaturesArray[2].id,
                dtoUpdateOrderAndCategoryMock,
            );

            expect(result).toEqual(resultMock);
            expect(findFeatureSpy).toHaveBeenCalledWith(FeaturesArray[2].id);
            expect(prismaMock.featureCategory.findFirst).toHaveBeenCalledWith({
                where: {
                    id: dtoUpdateOrderAndCategoryMock.featureCategoryId,
                },
                select: {
                    id: true,
                },
            });
            expect(prismaMock.projectFeature.findMany).toHaveBeenCalledWith({
                where: {
                    featureCategoryId: mockFeatureCategory.id,
                    addedBy: { voyageTeamId: mockTeamId },
                },
            });
            expect(prismaMock.projectFeature.update).toHaveBeenCalledWith({
                where: { id: FeaturesArray[1].id },
                data: {
                    order: FeaturesArray[1].order + 1,
                },
            });
            expect(prismaMock.projectFeature.update).toHaveBeenCalledWith({
                where: { id: FeaturesArray[2].id },
                data: {
                    order: dtoUpdateOrderAndCategoryMock.order,
                },
            });
            expect(findAllFeaturesSpy).toHaveBeenCalledWith(
                mockTeamId,
                requestMock,
            );
        });
        it("should update a feature order in the same feature category having new order greater than current order", async () => {
            const FeaturesArray = [
                {
                    id: 1,
                    teamMemberId: 1,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 1,
                    order: 1,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
                {
                    id: 2,
                    teamMemberId: 2,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 1,
                    order: 2,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
                {
                    id: 3,
                    teamMemberId: 2,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 1,
                    order: 3,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
                {
                    id: 4,
                    teamMemberId: 2,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    featureCategoryId: 1,
                    order: 4,
                    description:
                        "It is a very good feature that is very useful for the team",
                },
            ];
            const resultMock = [
                {
                    ...FeaturesArray[0],
                    order: 1,
                },
                {
                    ...FeaturesArray[1],
                    order: 2,
                },
                {
                    ...FeaturesArray[3],
                    order: 3,
                },
                {
                    ...FeaturesArray[2],
                    order: 4,
                },
            ];
            const dtoUpdateOrderAndCategoryMock: UpdateFeatureOrderAndCategoryDto =
                {
                    order: 4,
                    featureCategoryId: 1,
                };
            const mockFeatureCategory = { id: 1 } as FeatureCategory;

            const findFeatureSpy = jest
                .spyOn(service as any, "findFeature")
                .mockResolvedValue({
                    ...FeaturesArray[2],
                    addedBy: {
                        voyageTeamId: mockTeamId,
                    },
                });
            const findAllFeaturesSpy = jest
                .spyOn(service, "findAllFeatures")
                .mockResolvedValue(resultMock as any);
            prismaMock.featureCategory.findFirst.mockResolvedValueOnce(
                mockFeatureCategory,
            );
            prismaMock.projectFeature.findMany.mockResolvedValueOnce(
                FeaturesArray,
            );
            prismaMock.projectFeature.update
                .mockResolvedValueOnce({
                    ...FeaturesArray[3],
                    order: FeaturesArray[3].order - 1,
                })
                .mockResolvedValueOnce({
                    ...FeaturesArray[2],
                    order: FeaturesArray[2].order + 1,
                });
            const result = await service.updateFeatureOrderAndCategory(
                requestMock,
                FeaturesArray[2].id,
                dtoUpdateOrderAndCategoryMock,
            );

            expect(result).toEqual(resultMock);
            expect(findFeatureSpy).toHaveBeenCalledWith(FeaturesArray[2].id);
            expect(prismaMock.featureCategory.findFirst).toHaveBeenCalledWith({
                where: {
                    id: dtoUpdateOrderAndCategoryMock.featureCategoryId,
                },
                select: {
                    id: true,
                },
            });
            expect(prismaMock.projectFeature.findMany).toHaveBeenCalledWith({
                where: {
                    featureCategoryId: mockFeatureCategory.id,
                    addedBy: { voyageTeamId: mockTeamId },
                },
            });
            expect(prismaMock.projectFeature.update).toHaveBeenCalledWith({
                where: { id: FeaturesArray[3].id },
                data: {
                    order: FeaturesArray[3].order - 1,
                },
            });
            expect(prismaMock.projectFeature.update).toHaveBeenCalledWith({
                where: { id: FeaturesArray[2].id },
                data: {
                    order: dtoUpdateOrderAndCategoryMock.order,
                },
            });
            expect(findAllFeaturesSpy).toHaveBeenCalledWith(
                mockTeamId,
                requestMock,
            );
        });
    });
});
