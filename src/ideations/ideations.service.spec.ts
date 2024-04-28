import { Test, TestingModule } from "@nestjs/testing";
import { IdeationsService } from "./ideations.service";
import { PrismaService } from "../prisma/prisma.service";
import { GlobalService } from "../global/global.service";
import { CustomRequest } from "../global/types/CustomRequest";

describe("IdeationsService", () => {
    let service: IdeationsService;

    const ideationArr = [
        {
            id: 1,
            title: "Ideation 1",
            description: "Ideation 1 description",
            vision: "Ideation 1 vision",
            voyageTeamMemberId: 1,
        },
    ];
    const ideationOne = ideationArr[0];

    const ideationVoteArr = [
        { id: 1, projectIdeaId: 1, voyageTeamMemberId: 1 },
    ];
    const ideationVoteOne = ideationVoteArr[0];

    const memberArr = [
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            userId: "00a10ade-7308-11ee-b962-0242ac120002",
            voyageTeamId: 1,
            userVoyageId: {
                voyageTeamId: 1,
                userId: "00a10ade-7308-11ee-b962-0242ac120002",
            },
            hrPerSprint: 12,
            projectIdeas: ideationArr,
        },
        {
            id: 2,
            firstName: "John",
            lastName: "Smith",
            userId: "00a10ade-7308-11ee-a962-0242ac120002",
            voyageTeamId: 1,
            userVoyageId: {
                voyageTeamId: 1,
                userId: "00a10ade-7308-11ee-a962-0242ac120002",
            },
            hrPerSprint: 18,
            projectIdeas: [],
        },
    ];
    const memberOne = memberArr[0];

    const db = {
        projectIdea: {
            create: jest.fn().mockResolvedValue(ideationOne),
            findFirst: jest.fn().mockResolvedValue(ideationOne),
            findUnique: jest.fn().mockResolvedValue(ideationOne),
            update: jest.fn().mockResolvedValue(ideationOne),
            delete: jest.fn().mockResolvedValue(ideationOne),
        },
        projectIdeaVote: {
            create: jest.fn().mockResolvedValue(ideationVoteOne),
            findMany: jest
                .fn()
                .mockImplementation(
                    (voyageTeamMemberId?: number, projectIdeaId?: number) => {
                        if (voyageTeamMemberId && projectIdeaId) {
                            return ideationVoteArr.filter((vote) => {
                                return (
                                    vote.voyageTeamMemberId ===
                                        voyageTeamMemberId &&
                                    vote.projectIdeaId === projectIdeaId
                                );
                            });
                        } else if (voyageTeamMemberId) {
                            return ideationVoteArr.filter((vote) => {
                                return (
                                    vote.voyageTeamMemberId ===
                                    voyageTeamMemberId
                                );
                            });
                        } else if (projectIdeaId) {
                            return ideationVoteArr.filter((vote) => {
                                return vote.projectIdeaId === projectIdeaId;
                            });
                        } else {
                            return ideationVoteArr;
                        }
                    },
                ),
            findFirst: jest.fn().mockResolvedValue(ideationVoteOne),
            findUnique: jest.fn().mockResolvedValue(ideationVoteOne),
            delete: jest.fn().mockResolvedValue(ideationVoteOne),
        },
        voyageTeamMember: {
            findMany: jest.fn().mockResolvedValue(memberArr),
            findFirst: jest.fn().mockResolvedValue(memberOne),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IdeationsService,
                {
                    provide: PrismaService,
                    useValue: db,
                },
                GlobalService,
            ],
        }).compile();

        service = module.get<IdeationsService>(IdeationsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should create an ideation", async () => {
        const userId = "00a10ade-7308-11ee-b962-0242ac120002";
        const teamId = 1;
        const req = {
            user: {
                userId: userId,
                voyageTeams: [
                    {
                        teamId: 1,
                        memberId: 1,
                    },
                ],
            },
        } as CustomRequest;
        const createIdeationDto = {
            req,
            title: "Ideation 1",
            description: "Ideation 1 description",
            vision: "Ideation 1 vision",
        };

        const result = await service.createIdeation(
            req,
            teamId,
            createIdeationDto,
        );
        expect(result).toEqual(ideationOne);
    });

    it("should create an ideation vote", async () => {
        const userId = "00a10ade-7308-11ee-a962-0242ac120002";
        const teamId = 1;
        const ideationId = 1;
        const req = {
            user: {
                userId: userId,
                voyageTeams: [
                    {
                        teamId: 1,
                        memberId: 1,
                    },
                ],
            },
        };

        const result = await service.createIdeationVote(
            req,
            teamId,
            ideationId,
        );
        expect(result).toEqual(ideationVoteOne);
    });

    it("should get ideations by voyage team", async () => {
        const teamId = 1;
        const userId = "00a10ade-7308-11ee-a962-0242ac120002";
        const req = {
            user: {
                userId: userId,
                voyageTeams: [
                    {
                        teamId: 1,
                        memberId: 1,
                    },
                ],
            },
        } as CustomRequest;

        const result = await service.getIdeationsByVoyageTeam(req, teamId);
        expect(result).toEqual(ideationArr);
    });

    it("should update an ideation", async () => {
        const userId = "00a10ade-7308-11ee-b962-0242ac120002";
        const ideationId = 1;
        const teamId = 1;
        const req = {
            user: {
                userId: userId,
                voyageTeams: [
                    {
                        teamId: 1,
                        memberId: 1,
                    },
                ],
            },
        } as CustomRequest;
        const updateIdeationDto = {
            req,
            title: "Ideation 1",
            description: "Ideation 1 description",
            vision: "Ideation 1 vision",
        };

        const result = await service.updateIdeation(
            req,
            ideationId,
            teamId,
            updateIdeationDto,
        );
        expect(result).toEqual(ideationOne);
    });

    it("should delete an ideation vote", async () => {
        const userId = "00a10ade-7308-11ee-a962-0242ac120002";
        const teamId = 1;
        const ideationId = 1;
        const req = {
            user: {
                userId: userId,
                voyageTeams: [
                    {
                        teamId: 1,
                        memberId: 1,
                    },
                ],
            },
        } as CustomRequest;

        const result = await service.deleteIdeationVote(
            req,
            teamId,
            ideationId,
        );
        expect(result).toEqual(ideationVoteOne);
    });

    it("should delete an ideation", async () => {
        const userId = "00a10ade-7308-11ee-b962-0242ac120002";
        const ideationId = 1;
        const teamId = 1;
        const req = {
            user: {
                userId: userId,
                voyageTeams: [
                    {
                        teamId: 1,
                        memberId: 1,
                    },
                ],
            },
        } as CustomRequest;
        const result = await service.deleteIdeation(req, teamId, ideationId);
        expect(result).toEqual(ideationOne);
    });
});
