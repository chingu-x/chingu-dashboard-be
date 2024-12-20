import { Test, TestingModule } from "@nestjs/testing";
import { FeaturesController } from "./features.controller";
import { FeaturesService } from "./features.service";
import { CustomRequest } from "@/global/types/CustomRequest";
import { UpdateFeatureDto } from "./dto/update-feature.dto";
import { CreateFeatureDto } from "./dto/create-feature.dto";
import { UpdateFeatureOrderAndCategoryDto } from "./dto/update-feature-order-and-category.dto";

const requestMock = {} as unknown as CustomRequest;
const mockDate = new Date("2024-11-05T02:41:03.575Z");

const mockFeature = {
    id: 1,
    teamMemberId: 1,
    createdAt: mockDate,
    updatedAt: mockDate,
    featureCategoryId: 1,
    order: 1,
    description: "It is a very good feature that is very useful for the team",
};

const mockUpdatedFeature = {
    ...mockFeature,
    description: "It is the best feature",
};

const mockUpdatedFeatureOrderAndCategory = {
    ...mockFeature,
    order: 2,
    featureCategoryId: 2,
    addedBy: {
        member: {
            firstName: "Larry",
            lastName: "Castro",
            id: "18093ad0-88ef-4bcd-bee8-322749c876bd",
            avatar: "https://gravatar.com/avatar/90383a4ee0fb891c1ec3374e6a593a6c6fd88166d4fd45f796dabeaba7af836d?s=200&r=g&d=wavatar\n",
        },
    },
    category: {
        id: 2,
        name: "should have",
    },
};

const mockFeaturesArray = [
    {
        id: 1,
        teamMemberId: 1,
        createdAt: mockDate,
        updatedAt: mockDate,
        featureCategoryId: 1,
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

const mockTeamId: number = 1;

const dtoCreateMock: CreateFeatureDto = {
    description: "Chingu is a global collaboration platform",
    featureCategoryId: 1,
};

const dtoUpdateMock: UpdateFeatureDto = {
    teamMemberId: 1,
    description: "It is the best feature",
};

const dtoUpdateOrderAndCategoryMock: UpdateFeatureOrderAndCategoryDto = {
    order: 2,
    featureCategoryId: 2,
};

const mockFeatureService = {
    createFeature: jest.fn(),
    findFeatureCategories: jest.fn(),
    findAllFeatures: jest.fn(),
    findOneFeature: jest.fn(),
    updateFeature: jest.fn(),
    deleteFeature: jest.fn(),
    updateFeatureOrderAndCategory: jest.fn(),
};

describe("FeaturesController", () => {
    let controller: FeaturesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FeaturesController],
            providers: [FeaturesService],
        })
            .overrideProvider(FeaturesService)
            .useValue(mockFeatureService)
            .compile();

        controller = module.get<FeaturesController>(FeaturesController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("createFeature", () => {
        it("createFeature controller should be defined", async () => {
            expect(controller.createFeature).toBeDefined();
        });

        it("should create a new feature", async () => {
            mockFeatureService.createFeature.mockResolvedValue(mockFeature);

            const result = await controller.createFeature(
                requestMock,
                mockTeamId,
                dtoCreateMock,
            );

            expect(result).toEqual(mockFeature);
            expect(mockFeatureService.createFeature).toHaveBeenCalledWith(
                requestMock,
                mockTeamId,
                dtoCreateMock,
            );
        });
    });

    describe("findFeatureCategory", () => {
        it("findFeatureCategory controller should be defined", async () => {
            expect(controller.findFeatureCategory).toBeDefined();
        });

        it("should return all feature categories", async () => {
            mockFeatureService.findFeatureCategories.mockResolvedValue(
                mockFeatureCategory,
            );

            const result = await controller.findFeatureCategory();

            expect(result).toEqual(mockFeatureCategory);
            expect(mockFeatureService.findFeatureCategories).toHaveBeenCalled();
        });
    });

    describe("findAllFeatures", () => {
        it("findAllFeatures controller should be defined", async () => {
            expect(controller.findAllFeatures).toBeDefined();
        });

        it("should return all features", async () => {
            mockFeatureService.findAllFeatures.mockResolvedValue(
                mockFeaturesArray,
            );

            const result = await controller.findAllFeatures(
                requestMock,
                mockTeamId,
            );

            expect(result).toEqual(mockFeaturesArray);
            expect(mockFeatureService.findAllFeatures).toHaveBeenCalledWith(
                mockTeamId,
                requestMock,
            );
        });
    });

    describe("findOneFeature", () => {
        it("findOneFeature controller should be defined", async () => {
            expect(controller.findOneFeature).toBeDefined();
        });
        it("should return one feature", async () => {
            mockFeatureService.findOneFeature.mockResolvedValue(
                mockFeaturesArray[0],
            );
            const result = await controller.findOneFeature(
                requestMock,
                mockFeature.id,
            );
            expect(result).toEqual(mockFeaturesArray[0]);
            expect(mockFeatureService.findOneFeature).toHaveBeenCalledWith(
                mockFeature.id,
                requestMock,
            );
        });
    });

    describe("updateFeature", () => {
        it("updateFeature controller should be defined", async () => {
            expect(controller.updateFeature).toBeDefined();
        });

        it("should update a feature", async () => {
            mockFeatureService.updateFeature.mockResolvedValue(
                mockUpdatedFeature,
            );

            const result = await controller.updateFeature(
                requestMock,
                mockFeature.id,
                dtoUpdateMock,
            );

            expect(result).toEqual(mockUpdatedFeature);
            expect(mockFeatureService.updateFeature).toHaveBeenCalledWith(
                mockFeature.id,
                dtoUpdateMock,
                requestMock,
            );
        });
    });
    describe("Delete Feature", () => {
        it("deleteFeature controller should be defined", async () => {
            expect(controller.deleteFeature).toBeDefined();
        });

        it("should delete a feature", async () => {
            mockFeatureService.deleteFeature.mockResolvedValue({
                message: "Feature deleted successfully",
                status: 200,
            });

            const result = await controller.deleteFeature(
                requestMock,
                mockFeature.id,
            );

            expect(result).toEqual({
                message: expect.any(String),
                status: expect.any(Number),
            });
            expect(mockFeatureService.deleteFeature).toHaveBeenCalledWith(
                mockFeature.id,
                requestMock,
            );
        });
    });
    describe("Update Feature Order and Category", () => {
        it("updateFeatureOrderAndCategory controller should be defined", async () => {
            expect(controller.updateFeatureOrderAndCategory).toBeDefined();
        });

        it("should update feature order and category", async () => {
            mockFeatureService.updateFeatureOrderAndCategory.mockResolvedValue(
                mockUpdatedFeatureOrderAndCategory,
            );

            const result = await controller.updateFeatureOrderAndCategory(
                requestMock,
                mockFeature.id,
                dtoUpdateOrderAndCategoryMock,
            );

            expect(result).toEqual(mockUpdatedFeatureOrderAndCategory);
            expect(
                mockFeatureService.updateFeatureOrderAndCategory,
            ).toHaveBeenCalledWith(
                requestMock,
                mockFeature.id,
                dtoUpdateOrderAndCategoryMock,
            );
        });
    });
});
