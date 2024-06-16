import { Test, TestingModule } from "@nestjs/testing";
import { VoyagesController } from "./voyages.controller";
import { VoyagesService } from "./voyages.service";
import { CustomRequest } from "../global/types/CustomRequest";
import { CreateVoyageProjectSubmissionDto } from "./dto/create-voyage-project-submission.dto";
import { toBeArray } from "jest-extended";

expect.extend({ toBeArray });

describe("VoyagesController", () => {
    let controller: VoyagesController;

    const requestMock = {} as unknown as CustomRequest;

    const dtoMock = {
        voyageTeamId: 1,
        responses: [
            { questionId: 26, text: "All" },
            { questionId: 27, text: "Deploy app" },
        ],
    } as CreateVoyageProjectSubmissionDto;

    const mockVoyagesService = {
        submitVoyageProject: jest.fn((_requestMock, _dtoMock) => {
            return {
                id: 1,
                voyageTeamId: 1,
                responseGroupId: 1,
                createdAt: new Date(Date.now()),
            };
        }),
        getVoyageProjects: jest.fn(() => {
            return [
                {
                    id: 1,
                    voyageTeamId: 1,
                    responseGroupId: 1,
                    createdAt: new Date(Date.now()),
                },
                {
                    id: 2,
                    voyageTeamId: 2,
                    responseGroupId: 1,
                    createdAt: new Date(Date.now()),
                },
            ];
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VoyagesController],
            providers: [VoyagesService],
        })
            .overrideProvider(VoyagesService)
            .useValue(mockVoyagesService)
            .compile();

        controller = module.get<VoyagesController>(VoyagesController);
    });

    it("voyages controller should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("voyages service should be defined", () => {
        expect(controller.submitVoyageProject).toBeDefined();
    });

    describe("createVoyageProjectSubmission", () => {
        it("should be defined", () => {
            expect(controller.submitVoyageProject).toBeDefined();
        });

        it("should submit a voyage project", async () => {
            expect(
                await controller.submitVoyageProject(requestMock, dtoMock),
            ).toEqual({
                id: expect.any(Number),
                voyageTeamId: expect.any(Number),
                responseGroupId: expect.any(Number),
                createdAt: expect.any(Date),
            });

            expect(mockVoyagesService.submitVoyageProject).toHaveBeenCalledWith(
                requestMock,
                dtoMock,
            );
        });
    });

    describe("should get all voyage project submissions", () => {
        it("should be defined", () => {
            expect(controller.getAllVoyageProjects).toBeDefined();
        });

        it("should get all voyage project submissions", async () => {
            const projects = await controller.getAllVoyageProjects();
            expect(projects).toHaveLength(2);
            expect(projects).toBeArray();
            expect(projects).toContainEqual({
                id: expect.any(Number),
                voyageTeamId: expect.any(Number),
                responseGroupId: expect.any(Number),
                createdAt: expect.any(Date),
            });

            expect(mockVoyagesService.getVoyageProjects).toHaveBeenCalledWith();
        });
    });
});
