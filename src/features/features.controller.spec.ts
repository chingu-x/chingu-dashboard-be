import { Test, TestingModule } from "@nestjs/testing";
import { FeaturesController } from "./features.controller";
import { FeaturesService } from "./features.service";
import { CustomRequest } from "@/global/types/CustomRequest";

const requestMock = {} as unknown as CustomRequest;

const mockFeature = {
    id: 1,
    teamMemberId: 1,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
    featureCategoryId: 1,
    order: 1,
    description: "It is a very good feature that is very useful for the team",
};

const mockFeatureCategory = [
    {
        name: "must have",
        id: 1,
        description: "features that define your MVP",
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
    },
    {
        name: "should have",
        id: 2,
        description:
            '"stretch goals" to be worked on when you’ve implemented all the "Must Haves"',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
    },
    {
        name: "nice to have",
        id: 3,
        description:
            '"stretch goals" to be worked on when you’ve implemented all the "Must Haves" and "Should Haves"',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
    },
];

const mockTeamId: number = 1;

const dtoCreateMock = {
    description:
        "Chingu is a global collaboration platform and coding-cohort generator.",
    featureCategoryId: 1,
};

const mockFeatureService = {
    createFeature: jest.fn(),
    findFeatureCategories: jest.fn(),
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
        it("createNewFeature service should be defined", async () => {
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
        it("findFeatureCategory service should be defined", async () => {
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
});
