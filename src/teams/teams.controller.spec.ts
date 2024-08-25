import { Test, TestingModule } from "@nestjs/testing";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";
import { CustomRequest } from "../global/types/CustomRequest";
import { VoyageTeamMemberUpdateResponse } from "./teams.response";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";

describe("TeamsController", () => {
    let controller: TeamsController;

    const requestMock = {} as unknown as CustomRequest;

    const voyageTeamsMockResponseArray = [
        {
            id: 1,
            voyageId: 1,
            name: "v46-tier3-team-35",
            statusId: 1,
            repoUrl:
                "https://github.com/chingu-voyages/v46-tier3-chinguweather",
            repoUrlBE: "https://github.com/chingu-voyages/Handbook",
            deployedUrl: "https://www.chingu.io/",
            deployedUrlBE:
                "https://stackoverflow.com/questions/4848964/difference-between-text-and-varchar-character-varying",
            tierId: 3,
            endDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            voyageId: 2,
            name: "v47-tier2-team-4",
            statusId: 1,
            repoUrl:
                "https://github.com/chingu-voyages/soloproject-tier3-chinguweather",
            repoUrlBE: "https://github.com/chingu-voyages/Handbook",
            deployedUrl: "https://www.chingu.io/",
            deployedUrlBE:
                "https://stackoverflow.com/questions/4848964/difference-between-text-and-varchar-character-varying",
            tierId: 1,
            endDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const voyageTeamMemberUpdateMockResponse = {
        id: 4,
        userId: "0665df9b-2d53-4926-9a4f-8e89944a8b62",
        voyageTeamId: 1,
        voyageRoleId: 1,
        statusId: 1,
        hrPerSprint: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as VoyageTeamMemberUpdateResponse;

    const mockUpdateTeamMemberDto = {
        hrPerSprint: 35,
    } as UpdateTeamMemberDto;

    const mockTeamsService = {
        findAll: jest.fn(() => {
            return voyageTeamsMockResponseArray;
        }),
        findTeamsByVoyageId: jest.fn(() => {
            return [voyageTeamsMockResponseArray[0]];
        }),
        findTeamById: jest.fn(() => {
            return voyageTeamsMockResponseArray[0];
        }),
        updateTeamMemberById: jest.fn(() => {
            return voyageTeamMemberUpdateMockResponse;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TeamsController],
            providers: [TeamsService],
        })
            .overrideProvider(TeamsService)
            .useValue(mockTeamsService)
            .compile();

        controller = module.get<TeamsController>(TeamsController);
    });

    it("Teams controller should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("get all voyage teams", () => {
        it("should be defined", () => {
            expect(controller.findAll).toBeDefined();
        });

        it("should return all voyage teams", async () => {
            const teams = await controller.findAll();
            expect(teams).toHaveLength(2);
            expect(teams).toBeArray;
            expect(teams[0]).toEqual({
                id: expect.any(Number),
                voyageId: expect.any(Number),
                name: expect.any(String),
                statusId: expect.any(Number),
                repoUrl: expect.any(String),
                repoUrlBE: expect.any(String),
                deployedUrl: expect.any(String),
                deployedUrlBE: expect.any(String),
                tierId: expect.any(Number),
                endDate: expect.any(Date),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });

            expect(mockTeamsService.findAll).toHaveBeenCalled();
        });
    });

    describe("get all teams in a single voyage", () => {
        it("should be defined", () => {
            expect(controller.findTeamsByVoyageId).toBeDefined();
        });

        it("should return all teams in a single voyage", async () => {
            const teams = await controller.findTeamsByVoyageId(1);
            expect(teams).toHaveLength(1);
            expect(teams).toBeArray;
            expect(teams[0]).toEqual({
                id: expect.any(Number),
                voyageId: expect.any(Number),
                name: expect.any(String),
                statusId: expect.any(Number),
                repoUrl: expect.any(String),
                repoUrlBE: expect.any(String),
                deployedUrl: expect.any(String),
                deployedUrlBE: expect.any(String),
                tierId: expect.any(Number),
                endDate: expect.any(Date),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });

            expect(mockTeamsService.findTeamsByVoyageId).toHaveBeenCalled();
        });
    });

    describe("get a team by id", () => {
        it("should be defined", () => {
            expect(controller.findTeamById).toBeDefined();
        });

        it("should return a single team by id", async () => {
            const team = await controller.findTeamById(1, requestMock);
            expect(team).toEqual({
                id: expect.any(Number),
                voyageId: expect.any(Number),
                name: expect.any(String),
                statusId: expect.any(Number),
                repoUrl: expect.any(String),
                repoUrlBE: expect.any(String),
                deployedUrl: expect.any(String),
                deployedUrlBE: expect.any(String),
                tierId: expect.any(Number),
                endDate: expect.any(Date),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });

            expect(mockTeamsService.findTeamById).toHaveBeenCalled();
        });
    });

    describe("update a team member's hours per week by id", () => {
        it("should be defined", () => {
            expect(controller.updateTeamMemberById).toBeDefined();
        });

        it("should return team member object with updated sprint hours", async () => {
            const member = await controller.updateTeamMemberById(
                1,
                requestMock,
                mockUpdateTeamMemberDto,
            );
            expect(member).toEqual({
                id: expect.any(Number),
                userId: expect.any(String),
                voyageTeamId: expect.any(Number),
                voyageRoleId: expect.any(Number),
                statusId: expect.any(Number),
                hrPerSprint: expect.any(Number),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });

            expect(mockTeamsService.updateTeamMemberById).toHaveBeenCalled();
        });
    });
});
