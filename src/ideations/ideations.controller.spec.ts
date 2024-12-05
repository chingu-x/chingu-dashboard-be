import { Test, TestingModule } from "@nestjs/testing";
import { IdeationsController } from "./ideations.controller";
import { IdeationsService } from "./ideations.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";
import { CustomRequest } from "@/global/types/CustomRequest";

describe("IdeationsController", () => {
    let controller: IdeationsController;
    let service: IdeationsService;
    // Mock data
    const mockDate = new Date("2024-10-23T02:41:03.575Z");
    const ideationOne = {
        id: 1,
        title: "Ideation 1",
        description: "Ideation 1 description",
        vision: "Ideation 1 vision",
        createdAt: mockDate,
        updatedAt: mockDate,
    };

    const ideationVoteOne = { id: 1, projectIdeaId: 1 };

    // Create complete mock service matching IdeationsService exactly
    const mockIdeationsService = {
        createIdeation: jest.fn().mockResolvedValue(ideationOne),
        getIdeationsByVoyageTeam: jest.fn().mockResolvedValue([ideationOne]),
        updateIdeation: jest.fn().mockResolvedValue(ideationOne),
        deleteIdeation: jest.fn().mockResolvedValue(ideationOne),
        createIdeationVote: jest.fn().mockResolvedValue(ideationVoteOne),
        deleteIdeationVote: jest.fn().mockResolvedValue(ideationVoteOne),
        getSelectedIdeation: jest.fn().mockResolvedValue(ideationOne),
        setIdeationSelection: jest.fn().mockResolvedValue(ideationOne),
        resetIdeationSelection: jest.fn().mockResolvedValue(ideationOne),
        hasIdeationVote: jest.fn().mockResolvedValue(false),
        checkIdeationAndVotes: jest.fn().mockResolvedValue(1),
        removeIdeation: jest.fn().mockResolvedValue(ideationOne),
        removeVote: jest.fn().mockResolvedValue(ideationVoteOne),
    } as unknown as IdeationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [IdeationsController],
            providers: [
                {
                    provide: IdeationsService,
                    useValue: mockIdeationsService,
                },
            ],
        }).compile();

        controller = module.get<IdeationsController>(IdeationsController);
        service = module.get<IdeationsService>(IdeationsService);

        // Reset all mocks
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
    describe("createIdeation", () => {
        it("should have createIdeation defined", () => {
            expect(service.createIdeation).toBeDefined();
        });
        it("should call service.createIdeation with correct parameters", async () => {
            const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
            const teamId = 1;
            const createIdeationDto: CreateIdeationDto = {
                title: "Ideation 1",
                description: "Ideation 1 description",
                vision: "Ideation 1 vision",
            };
            const req = {
                user: {
                    userId: userId,
                },
            } as CustomRequest;
            await controller.createIdeation(req, teamId, createIdeationDto);
            expect(service.createIdeation).toHaveBeenCalledWith(
                req,
                teamId,
                createIdeationDto,
            );
        });
    });
    describe("createIdeationVote", () => {
        it("should have createIdeationVote defined", () => {
            expect(service.createIdeationVote).toBeDefined();
        });
        it("should call service.createIdeationVote with correct parameters", async () => {
            const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
            const ideationId = 1;
            const req = {
                user: {
                    userId: userId,
                },
            } as CustomRequest;
            await controller.createIdeationVote(req, ideationId);

            expect(service.createIdeationVote).toHaveBeenCalledWith(
                req,
                ideationId,
            );
        });
    });
    describe("getIdeationsByVoyageTeam", () => {
        it("should have getIdeationsByVoyageTeam defined", () => {
            expect(service.getIdeationsByVoyageTeam).toBeDefined();
        });
        it("should call service.getIdeationsByVoyageTeam with correct parameters", async () => {
            const teamId = 1;
            const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
            const req = {
                user: {
                    userId,
                    voyageTeams: [{ teamId, memberId: 1 }],
                },
            } as CustomRequest;
            await controller.getIdeationsByVoyageTeam(teamId, req);

            expect(service.getIdeationsByVoyageTeam).toHaveBeenCalled();
        });
    });

    describe("updateIdeation", () => {
        it("should have updateIdeation method", () => {
            expect(controller.updateIdeation).toBeDefined();
        });

        it("should call service.updateIdeation with correct parameters", async () => {
            const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
            const ideationId = 1;
            const req = {
                user: {
                    userId: userId,
                },
            } as CustomRequest;
            const updateIdeationDto: UpdateIdeationDto = {
                title: "Ideation 1",
                description: "Ideation 1 description",
                vision: "Ideation 1 vision",
            };

            await controller.updateIdeation(req, ideationId, updateIdeationDto);

            expect(service.updateIdeation).toHaveBeenCalledWith(
                req,
                ideationId,
                updateIdeationDto,
            );
        });
    });
    describe("deleteIdeation", () => {
        it("should have deleteIdeation method", () => {
            expect(controller.deleteIdeation).toBeDefined();
        });

        it("should call service.deleteIdeation with correct parameters", async () => {
            const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
            const ideationId = 1;
            const req = {
                user: {
                    userId: userId,
                },
            } as CustomRequest;

            await controller.deleteIdeation(req, ideationId);

            expect(service.deleteIdeation).toHaveBeenCalledWith(
                req,
                ideationId,
            );
        });
    });

    describe("deleteIdeationVote", () => {
        it("should have deleteIdeationVote method", () => {
            expect(controller.deleteIdeationVote).toBeDefined();
        });

        it("should call service.deleteIdeationVote with correct parameters", async () => {
            const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
            const ideationId = 1;
            const req = {
                user: {
                    userId: userId,
                },
            } as CustomRequest;

            await controller.deleteIdeationVote(req, ideationId);

            expect(service.deleteIdeationVote).toHaveBeenCalledWith(
                req,
                ideationId,
            );
        });
    });

    describe("setIdeationSelection", () => {
        it("should have setIdeationSelection method", () => {
            expect(controller.setIdeationSelection).toBeDefined();
        });

        it("should call service.setIdeationSelection with correct parameters", async () => {
            const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
            const teamId = 1;
            const ideationId = 1;
            const req = {
                user: {
                    userId: userId,
                },
            } as CustomRequest;

            await controller.setIdeationSelection(req, teamId, ideationId);

            expect(service.setIdeationSelection).toHaveBeenCalledWith(
                req,
                teamId,
                ideationId,
            );
        });
    });

    describe("resetIdeationSelection", () => {
        it("should have resetIdeationSelection method", () => {
            expect(controller.resetIdeationSelection).toBeDefined();
        });

        it("should call service.resetIdeationSelection with correct parameters", async () => {
            const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
            const teamId = 1;
            const req = {
                user: {
                    userId: userId,
                },
            } as CustomRequest;

            await controller.resetIdeationSelection(req, teamId);

            expect(service.resetIdeationSelection).toHaveBeenCalledWith(
                req,
                teamId,
            );
        });
    });
});
