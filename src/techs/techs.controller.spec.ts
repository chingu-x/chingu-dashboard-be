import { Test, TestingModule } from "@nestjs/testing";
import { TechsController } from "./techs.controller";
import { TechsService } from "./techs.service";
import { CustomRequest } from "@/global/types/CustomRequest";
import { CreateTeamTechDto } from "./dto/create-tech.dto";
import { UpdateTeamTechDto } from "./dto/update-tech.dto";
//import { UpdateTechSelectionsDto } from "./dto/update-tech-selections.dto";
import { CreateTechStackCategoryDto } from "./dto/create-techstack-category.dto";
import { UpdateTechStackCategoryDto } from "./dto/update-techstack-category.dto";

describe("TechsController", () => {
    let controller: TechsController;

    const requestMock = {} as unknown as CustomRequest;

    const mockTechsService = {
        getAllTechItemsByTeamId: jest.fn(),
        addNewTeamTech: jest.fn(),
        updateTeamTech: jest.fn(),
        deleteTeamTech: jest.fn(),
        addNewTechStackCategory: jest.fn(),
        updateTechStackCategory: jest.fn(),
        deleteTechStackCategory: jest.fn(),
        addExistingTechVote: jest.fn(),
        removeVote: jest.fn(),
        updateTechStackSelections: jest.fn(),
    };
    const teamId = 1;
    const techStackCategoryId = 1;
    const teamTechItemId = 1;

    const mockTeamTechItems = [
        {
            id: 1,
            name: "Frontend",
            description: "Frontend Stuff",
            teamTechStackItems: [],
        },
        {
            id: 2,
            name: "CSS Library",
            description: "CSS Library",
            teamTechStackItems: [],
        },
        {
            id: 3,
            name: "Backend",
            description: "Backend Stuff",
            teamTechStackItems: [],
        },
    ];

    const mockNewTeamTechResponse = {
        teamTechStackItemVoteId: 1,
        teamTechId: 1,
        teamMemberId: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    const createTeamTechDto = {
        techName: "testTech",
        techCategoryId: 1,
        voyageTeamMemberId: 1,
    } as CreateTeamTechDto;

    const updateTeamTechDto = {
        techName: "testUpdate",
    } as UpdateTeamTechDto;

    const mockUpdateTeamTechResponse = {
        id: 1,
        name: "Typescript",
        voyageTeamMemberId: 8,
        voyageTeamId: 2,
        teamTechStackItemVotes: [
            {
                votedBy: {
                    member: {
                        id: "0c106af5-6b5a-4103-b206-1e10f0903bee",
                        firstName: "Joso",
                        lastName: "Madar",
                        avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=wavatar&r=x",
                    },
                },
            },
        ],
    };

    const mockDeleteTechStackItemResponse = {
        message: "The  tech stack item is deleted",
        statusCode: 200,
    };

    const mockCreateTechStackCategoryDto = {
        name: "test category",
        description: "unit test",
    } as CreateTechStackCategoryDto;

    const updateTechStackCategoryDto = {
        newName: "new name",
        description: "test",
    } as UpdateTechStackCategoryDto;

    const mockUpdateCategoryResponse = {
        id: 10,
        name: "CDN",
        description: "Static storage",
        voyageTeamId: 1,
        createdAt: "2023-12-01T13:55:00.611Z",
        updatedAt: "2023-12-01T13:55:00.611Z",
    };

    const mockDeleteCategoryResponse = {
        message: "The tech stack category was deleted",
        statusCode: 200,
    };

    const mockVoteResponse = {
        teamTechStackItemVotedId: 10,
        teamTechId: 11,
        teamMemberId: 8,
        createdAt: "2023-12-01T13:55:00.611Z",
        updatedAt: "2023-12-01T13:55:00.611Z",
    };

    const mockDeleteVoteResponse = {
        message: "The vote and tech stack item were deleted",
        statusCode: 200,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TechsController],
            providers: [TechsService],
        })
            .overrideProvider(TechsService)
            .useValue(mockTechsService)
            .compile();

        controller = module.get<TechsController>(TechsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getAllTechItemsByTeamId", () => {
        it("should be defined", () => {
            expect(controller.getAllTechItemsByTeamId).toBeDefined();
        });

        it("should return and array of team's tech items", async () => {
            mockTechsService.getAllTechItemsByTeamId.mockResolvedValueOnce(
                mockTeamTechItems,
            );

            const result = await mockTechsService.getAllTechItemsByTeamId(
                requestMock,
                teamId,
            );

            expect(result).toEqual(mockTeamTechItems);

            expect(
                mockTechsService.getAllTechItemsByTeamId,
            ).toHaveBeenCalledWith(requestMock, teamId);
        });
    });

    describe("addNewTeamTech", () => {
        it("should be defined", () => {
            expect(controller.addNewTeamTech).toBeDefined();
        });

        it("should add new team tech stack item", async () => {
            mockTechsService.addNewTeamTech.mockResolvedValueOnce(
                mockNewTeamTechResponse,
            );

            const result = await mockTechsService.addNewTeamTech(
                requestMock,
                teamId,
                createTeamTechDto,
            );

            expect(result).toEqual(mockNewTeamTechResponse);

            expect(mockTechsService.addNewTeamTech).toHaveBeenCalledWith(
                requestMock,
                teamId,
                createTeamTechDto,
            );
        });
    });

    describe("updateTeamTech", () => {
        it("should be defined", () => {
            expect(controller.updateTeamTech).toBeDefined();
        });

        it("should update team tech", async () => {
            mockTechsService.updateTeamTech.mockResolvedValueOnce(
                mockUpdateTeamTechResponse,
            );

            const result = await mockTechsService.updateTeamTech(
                requestMock,
                updateTeamTechDto,
                teamTechItemId,
            );

            expect(result).toEqual(mockUpdateTeamTechResponse);

            expect(mockTechsService.updateTeamTech).toHaveBeenCalledWith(
                requestMock,
                updateTeamTechDto,
                teamTechItemId,
            );
        });
    });

    describe("deleteTeamTech", () => {
        it("should be defined", () => {
            expect(controller.deleteTeamTech).toBeDefined();
        });

        it("should delete a team tech", async () => {
            mockTechsService.deleteTeamTech.mockResolvedValueOnce(
                mockDeleteTechStackItemResponse,
            );

            const result = await mockTechsService.deleteTeamTech(
                requestMock,
                teamTechItemId,
            );

            expect(result).toEqual(mockDeleteTechStackItemResponse);

            expect(mockTechsService.deleteTeamTech).toHaveBeenCalledWith(
                requestMock,
                teamTechItemId,
            );
        });
    });

    describe("addNewTechStackCategory", () => {
        it("should be defined", () => {
            expect(controller.addNewTechStackCategory).toBeDefined();
        });

        it("should delete a team tech", async () => {
            mockTechsService.addNewTechStackCategory.mockResolvedValueOnce(
                mockDeleteTechStackItemResponse,
            );

            const result = await mockTechsService.addNewTechStackCategory(
                requestMock,
                teamId,
                mockCreateTechStackCategoryDto,
            );

            expect(result).toEqual(mockDeleteTechStackItemResponse);

            expect(
                mockTechsService.addNewTechStackCategory,
            ).toHaveBeenCalledWith(
                requestMock,
                teamId,
                mockCreateTechStackCategoryDto,
            );
        });
    });

    describe("updateTechStackCategory", () => {
        it("should be defined", () => {
            expect(controller.updateTechStackCategory).toBeDefined();
        });

        it("should update a tech category", async () => {
            mockTechsService.updateTechStackCategory.mockResolvedValueOnce(
                mockUpdateCategoryResponse,
            );

            const result = await mockTechsService.updateTechStackCategory(
                requestMock,
                techStackCategoryId,
                updateTechStackCategoryDto,
            );

            expect(result).toEqual(mockUpdateCategoryResponse);

            expect(
                mockTechsService.updateTechStackCategory,
            ).toHaveBeenCalledWith(
                requestMock,
                techStackCategoryId,
                updateTechStackCategoryDto,
            );
        });
    });

    describe("deleteTechStackCategory", () => {
        it("should be defined", () => {
            expect(controller.deleteTechStackCategory).toBeDefined();
        });

        it("should delete a tech category", async () => {
            mockTechsService.deleteTechStackCategory.mockResolvedValueOnce(
                mockDeleteCategoryResponse,
            );

            const result = await mockTechsService.deleteTechStackCategory(
                requestMock,
                techStackCategoryId,
            );

            expect(result).toEqual(mockDeleteCategoryResponse);

            expect(
                mockTechsService.deleteTechStackCategory,
            ).toHaveBeenCalledWith(requestMock, techStackCategoryId);
        });
    });

    describe("addExistingTechVote", () => {
        it("should be defined", () => {
            expect(controller.addExistingTechVote).toBeDefined();
        });

        it("should add a tech vote", async () => {
            mockTechsService.addExistingTechVote.mockResolvedValueOnce(
                mockVoteResponse,
            );

            const result = await mockTechsService.addExistingTechVote(
                requestMock,
                teamTechItemId,
            );

            expect(result).toEqual(mockVoteResponse);

            expect(mockTechsService.addExistingTechVote).toHaveBeenCalledWith(
                requestMock,
                teamTechItemId,
            );
        });
    });

    describe("removeVote", () => {
        it("should be defined", () => {
            expect(controller.removeVote).toBeDefined();
        });

        it("should remove a tech vote", async () => {
            mockTechsService.removeVote.mockResolvedValueOnce(
                mockDeleteVoteResponse,
            );

            const result = await mockTechsService.removeVote(
                requestMock,
                teamTechItemId,
            );

            expect(result).toEqual(mockDeleteVoteResponse);

            expect(mockTechsService.removeVote).toHaveBeenCalledWith(
                requestMock,
                teamTechItemId,
            );
        });
    });

    describe("updateTechStackSelections", () => {
        it("should be defined", () => {
            expect(controller.updateTechStackSelections).toBeDefined();
        });

        it("should ", async () => {
            mockTechsService.removeVote.mockResolvedValueOnce(
                mockDeleteVoteResponse,
            );

            const result = await mockTechsService.removeVote(
                requestMock,
                teamTechItemId,
            );

            expect(result).toEqual(mockDeleteVoteResponse);

            expect(mockTechsService.removeVote).toHaveBeenCalledWith(
                requestMock,
                teamTechItemId,
            );
        });
    });
});
