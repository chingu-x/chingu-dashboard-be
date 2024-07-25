import { Test, TestingModule } from "@nestjs/testing";
import { IdeationsController } from "./ideations.controller";
import { IdeationsService } from "./ideations.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";
import { CustomRequest } from "../global/types/CustomRequest";

describe("IdeationsController", () => {
    let controller: IdeationsController;
    let service: IdeationsService;

    const ideationArr = [
        {
            id: 1,
            title: "Ideation 1",
            description: "Ideation 1 description",
            vision: "Ideation 1 vision",
        },
    ];
    const ideationOne = ideationArr[0];

    const ideationVoteArr = [{ id: 1, projectIdeaId: 1 }];
    const ideationVoteOne = ideationVoteArr[0];

    const mockIdeationsService = {
        createIdeation: jest.fn().mockResolvedValue(ideationOne),
        createIdeationVote: jest.fn().mockResolvedValue(ideationVoteOne),
        getIdeationsByVoyageTeam: jest.fn().mockResolvedValue(ideationArr),
        updateIdeation: jest.fn().mockResolvedValue(ideationOne),
        deleteIdeation: jest.fn().mockResolvedValue(true),
        deleteIdeationVote: jest.fn().mockResolvedValue(true),
    };

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
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should create an ideation", async () => {
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
        const ideation = await controller.createIdeation(
            req,
            teamId,
            createIdeationDto,
        );
        expect(service.createIdeation).toHaveBeenCalled();
        expect(ideation).toBe(ideationOne);
    });

    it("should create an ideation vote", async () => {
        const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
        const ideationId = 1;
        const req = {
            user: {
                userId: userId,
            },
        } as CustomRequest;
        const ideationVote = await controller.createIdeationVote(
            req,
            ideationId,
        );

        expect(service.createIdeationVote).toHaveBeenCalled();
        expect(ideationVote).toBe(ideationVoteOne);
    });

    it("should get ideations by voyage team", async () => {
        const teamId = 1;
        const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
        const req = {
            user: {
                userId,
                voyageTeams: [{ teamId, memberId: 1 }],
            },
        } as CustomRequest;
        const ideations = await controller.getIdeationsByVoyageTeam(
            teamId,
            req,
        );

        expect(service.getIdeationsByVoyageTeam).toHaveBeenCalled();
        expect(ideations).toBe(ideationArr);
    });

    it("should update an ideation", async () => {
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
        const ideation = await controller.updateIdeation(
            req,
            ideationId,
            updateIdeationDto,
        );
        expect(service.updateIdeation).toHaveBeenCalled();
        expect(ideation).toEqual(ideationOne);
    });

    it("should delete an ideation", async () => {
        const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
        const ideationId = 1;
        const req = {
            user: {
                userId: userId,
            },
        } as CustomRequest;
        const ideation = await controller.deleteIdeation(req, ideationId);

        expect(service.deleteIdeation).toHaveBeenCalled();
        expect(ideation).toBe(true);
    });

    it("should delete an ideation vote", async () => {
        const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
        const ideationId = 1;
        const req = {
            user: {
                userId: userId,
            },
        } as CustomRequest;
        const ideationVote = await controller.deleteIdeationVote(
            req,
            ideationId,
        );

        expect(service.deleteIdeationVote).toHaveBeenCalled();
        expect(ideationVote).toBe(true);
    });
});
