import { Test, TestingModule } from "@nestjs/testing";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";

describe("TeamsController", () => {
    let controller: TeamsController;
    let service: TeamsService;

    const teamArr = [
        { id: 1, voyageId: 1, name: "Team 1" }
    ];
    const teamOne = teamArr[0];

    const userOne = {
        firstName: "John",
        lastName: "Doe",
        avatar: "https://i.imgur.com/1.jpg",
        discordId: "john-discord",
        countryCode: "US",
        timezone: "America/New_York",
        email: "johndoe@user.io",
    };

    const memberArr = [
        {
            member: userOne,
            hrPerSprint: 12,
            voyageRole: { name: "Developer" },
            voyageTeamId: 1,
            userId: "cc1b7a12-72f6-11ee-b962-0242ac120002",
        },
    ];
    const memberOne = memberArr[0];

    const mockTeamsService = {
        findAll: jest.fn().mockResolvedValue(teamArr),
        findAllByVoyageId: jest.fn().mockImplementation((id: number) => [
            {
                voyageId: id,
                ...teamOne,
            },
        ]),
        findOne: jest.fn().mockImplementation((id: number) => {
            return {
                voyageId: id,
                ...teamOne
            };
        }),
        findTeamMembersByTeamId: jest.fn().mockImplementation((id: number) => {
            return [
                {
                    voyageTeamId: id,
                    ...memberOne,
                }
            ];
        }),
        updateTeamMemberById: jest
            .fn()
            .mockImplementation(
                (
                    teamId: number,
                    userId: string,
                    memberData: any,
                ) => 
                {
                    return {
                        voyageTeamId: teamId,
                        userId: userId,
                        ...memberData,
                        ...memberOne
                    }
                }
            ),

    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TeamsController],
            providers: [
                {
                    provide: TeamsService,
                    useValue: mockTeamsService
                },  
            ],
        }).compile();

        controller = module.get<TeamsController>(TeamsController);
        service = module.get<TeamsService>(TeamsService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should return an array of teams", async () => {
        const teams = await controller.findAll();

        expect(service.findAll).toHaveBeenCalled();
        expect(teams).toEqual(teamArr);
    });
    it("should return an array of teams by voyage id", async () => {
        const voyageId = 1;
        const teams = await controller.findTeamsByVoyageId(voyageId);

        expect(service.findAllByVoyageId).toHaveBeenCalledWith(voyageId);
        expect(teams).toEqual([teamOne]);
    });

    it("should return a team", async () => {
        const voyageId = 1;
        const team = await controller.findOne(voyageId);

        expect(service.findOne).toHaveBeenCalledWith(voyageId);
        expect(team).toEqual(teamOne);
    });

    it("should return an array of team members", async () => {
        const voyageId = 1;
        const teamMembers = await controller.findTeamMembersByTeamId(voyageId);

        expect(service.findTeamMembersByTeamId).toHaveBeenCalledWith(voyageId);
        expect(teamMembers).toEqual(memberArr);
    });
    it("should update a team member", async () => {
        const teamId = 1;
        const userId = "cc1b7a12-72f6-11ee-b962-0242ac120002";
        const updateTeamMemberDto = {
            hrPerSprint: 10,
        };
        const updatedTeamMember = await controller.update(
            teamId,
            userId,
            updateTeamMemberDto
        );
        expect(service.updateTeamMemberById).toHaveBeenCalledWith(
            teamId,
            userId,
            updateTeamMemberDto
        );
        expect(updatedTeamMember).toEqual(memberOne);
    });
});
