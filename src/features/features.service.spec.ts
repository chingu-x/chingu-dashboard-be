import { Test, TestingModule } from "@nestjs/testing";
import { FeaturesService } from "./features.service";
import { PrismaService } from "@/prisma/prisma.service";
import { GlobalService } from "@/global/global.service";
import { prismaMock } from "@/prisma/singleton";
import { CustomRequest } from "@/global/types/CustomRequest";
import { CreateFeatureDto } from "./dto/create-feature.dto";
/* import { UpdateFeatureDto } from "./dto/update-feature.dto";
import { UpdateFeatureOrderAndCategoryDto } from "./dto/update-feature-order-and-category.dto"; */

const userReq = {
    userId: "aa9d050e-5756-4c3c-bc04-071f39f53663",
    email: "test@test.com",
    roles: ["voyager"],
    isVerified: true,
    voyageTeams: [{ teamId: 1, memberId: 1 }],
};

const mockFeature = {
    id: 1,
    teamMemberId: 1,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
    featureCategoryId: 1,
    order: 1,
    description: "It is a very good feature that is very useful for the team",
};

const mockVoyageTeam = {
    id: 1,
};

const mockTeamId: number = 1;
const mockTeamMemberId: number = 1;
const requestMock = {
    user: userReq,
} as any as CustomRequest;

const mockGlobalService = {
    getVoyageTeamMemberId: jest.fn(),
};

const dtoCreateMock: CreateFeatureDto = {
    description: "Chingu is a global collaboration platform",
    featureCategoryId: 1,
};

/* const dtoUpdateMock: UpdateFeatureDto = {
    teamMemberId: 1,
    description: "It is the best feature",
};

const dtoUpdateOrderAndCategoryMock: UpdateFeatureOrderAndCategoryDto = {
    order: 2,
    featureCategoryId: 2,
}; */

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

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("createFeature", () => {
        it("createFeature service should be defined", async () => {
            expect(service.createFeature).toBeDefined();
        });

        it("should create a new feature", async () => {
            prismaMock.projectFeature.findFirst.mockResolvedValue(null);
            prismaMock.voyageTeam.findFirst.mockResolvedValue(
                mockVoyageTeam as any,
            );
            prismaMock.featureCategory.findFirst.mockResolvedValue({
                id: 1,
            } as any);
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
        });
    });
});
