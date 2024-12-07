import { Test, TestingModule } from "@nestjs/testing";
import { TechsService } from "./techs.service";
import { PrismaService } from "@/prisma/prisma.service";
import { GlobalService } from "@/global/global.service";
import { prismaMock } from "@/prisma/singleton";
import { CustomRequest } from "@/global/types/CustomRequest";

const mockTeamId = 1;
const requestMock = {
    user: {
        roles: ["admin"],
    },
} as unknown as CustomRequest;

const mockVoyageTeam = {
    id: 1,
    voyageId: 1,
    name: "Us",
    statusId: 1,
    repoUrl: "repo.com",
    repoUrlBE: "repoBE.com",
    deployedUrl: "deploy.com",
    deployedUrlBE: "deployBE.com",
    tierId: 1,
    endDate: new Date(Date.now()),
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
};

const mockTechCategories = [
    {
        id: 1,
        name: "Frontend",
        description: "Frontend Stuff",
        voyageTeamId: 1,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
    },
    {
        id: 2,
        name: "CSS Library",
        description: "CSS Library",
        voyageTeamId: 1,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
    },
    {
        id: 3,
        name: "Backend",
        description: "Backend Stuff",
        voyageTeamId: 1,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
    },
];

const mockGlobalService = {
    getAllTechItemsByTeamId: jest.fn(),
};

describe("TechsService", () => {
    let service: TechsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TechsService,
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

        service = module.get<TechsService>(TechsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getAllTechItemsByTeamId", () => {
        it("should return array of tech items", async () => {
            prismaMock.techStackCategory.findMany.mockResolvedValue(
                mockTechCategories,
            );
            prismaMock.voyageTeam.findUnique.mockResolvedValue(mockVoyageTeam);

            const result = await service.getAllTechItemsByTeamId(
                mockTeamId,
                requestMock,
            );
            expect(result).toBeArray;
            expect(result).toHaveLength(3);
            expect(result[0]).toEqual({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                voyageTeamId: expect.any(Number),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });

            expect(prismaMock.voyageTeam.findUnique).toHaveBeenCalledWith({
                where: { id: mockTeamId },
            });
        });
    });
});
