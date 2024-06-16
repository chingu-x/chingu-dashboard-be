import { Test, TestingModule } from "@nestjs/testing";
import { VoyagesService } from "./voyages.service";
import { GlobalService } from "../global/global.service";
import { PrismaService } from "../prisma/prisma.service";
import { CustomRequest } from "../global/types/CustomRequest";
import { CreateVoyageProjectSubmissionDto } from "./dto/create-voyage-project-submission.dto";
import { prismaMock } from "../prisma/singleton";
import { toBeArray } from "jest-extended";

expect.extend({ toBeArray });

describe("VoyagesService", () => {
    let service: VoyagesService;

    const requestMock = {
        user: {
            userId: "d31315ef-93c8-488f-a3f6-cb2df0016738",
            email: "test@test.com",
            role: ["voyager"],
            voyageTeams: [
                {
                    teamId: 1,
                    memberId: 1,
                },
            ],
        },
    } as unknown as CustomRequest;

    const dtoMock = {
        voyageTeamId: 1,
        responses: [
            { questionId: 26, text: "All" },
            { questionId: 27, text: "Deploy app" },
        ],
    } as CreateVoyageProjectSubmissionDto;

    const mockGlobalService = {
        responseDtoToArray: jest.fn((_dtoMock) => {
            return [_dtoMock.responses];
        }),
        checkQuestionsInFormByTitle: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VoyagesService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
                GlobalService,
                {
                    provide: GlobalService,
                    useValue: mockGlobalService,
                },
            ],
        }).compile();

        service = module.get<VoyagesService>(VoyagesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to submit a voyage project", async () => {
        prismaMock.$transaction.mockResolvedValueOnce({
            id: 1,
            voyageTeamId: 1,
            responseGroupId: 1,
            createdAt: new Date(Date.now()),
        });

        expect(await service.submitVoyageProject(requestMock, dtoMock)).toEqual(
            {
                id: expect.any(Number),
                voyageTeamId: expect.any(Number),
                responseGroupId: expect.any(Number),
                createdAt: expect.any(Date),
            },
        );

        expect(mockGlobalService.responseDtoToArray).toHaveBeenCalledWith(
            dtoMock,
        );

        expect(
            mockGlobalService.checkQuestionsInFormByTitle,
        ).toHaveBeenCalled();
    });

    it("should get all voyage projects ", async () => {
        prismaMock.formResponseVoyageProject.findMany.mockResolvedValue([
            {
                id: 1,
                voyageTeamId: 1,
                responseGroupId: 1,
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
            },
            {
                id: 2,
                voyageTeamId: 1,
                responseGroupId: 2,
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
            },
        ]);

        const projects = await service.getVoyageProjects();

        expect(projects).toHaveLength(2);
        expect(projects).toBeArray();
        expect(projects).toContainEqual({
            id: expect.any(Number),
            voyageTeamId: expect.any(Number),
            responseGroupId: expect.any(Number),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });
});
