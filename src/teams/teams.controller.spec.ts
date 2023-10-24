import { Test, TestingModule } from "@nestjs/testing";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";

describe("TeamsController", () => {
    let controller: TeamsController;
    let service: TeamsService;

    const teamArr = [
        {id: 1, voyageId: 1, name: "Team 1"},
        {id: 2, voyageId: 1, name: "Team 2"},
        {id: 3, voyageId: 2, name: "Team 3"},
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TeamsController],
            providers: [
                {
                    provide: TeamsService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue(teamArr),
                        findAllByVoyageId: jest
                            .fn()
                            .mockImplementation((id: number) => [
                                {
                                    voyageId: id,
                                    name: "Team Alpha",
                                },
                                {
                                    voyageId: id,
                                    name: "Team Omega",
                                },
                            ]),
                        findOne: jest.fn().mockImplementation((id: number) => {
                            return {
                                voyageId: id,
                                name: `Team ${id}`,
                            };
                        }),
                        findTeamMembersByTeamId: jest
                            .fn()
                            .mockImplementation((id: number) => {
                                return [
                                    {
                                        member: {
                                            firstName: "John",
                                            lastName: "Doe",
                                            avatar: "https://i.imgur.com/1.jpg",
                                            discordId: "123456789",
                                            countryCode: "US",
                                            timezone: "America/New_York",
                                            email: "johndoe@user.io",
                                        },
                                        hrPerSprint: 10,
                                        voyageRole: {
                                            name: "Developer",
                                        },
                                        voyageTeamId: id,
                                    },
                                    {
                                        member: {
                                            firstName: "Jane",
                                            lastName: "Smith",
                                            avatar: "https://i.imgur.com/2.jpg",
                                            discordId: "987654321",
                                            countryCode: "US",
                                            timezone: "America/New_York",
                                            email: "janesmith@user.io",
                                        },
                                        hrPerSprint: 2,
                                        voyageRole: {
                                            name: "Data Scientist",
                                        },
                                        voyageTeamId: id,
                                    },
                                    {
                                        member: {
                                            firstName: "John",
                                            lastName: "Smith",
                                            avatar: "https://i.imgur.com/3.jpg",
                                            discordId: "123498765",
                                            countryCode: "US",
                                            timezone: "America/New_York",
                                            email: "johnsmith@user.io",
                                        },
                                        hrPerSprint: 20,
                                        voyageRole: {
                                            name: "UI/UX Designer",
                                        },
                                        voyageTeamId: id,
                                    },
                                ];
                            }),
                        updateTeamMemberById: jest.fn().mockImplementation((id: number, userId: number, memberData: any) => (
                            {
                                where: {
                                    userVoyageId: {
                                        userId: userId,
                                        voyageTeamId: id,
                                    },
                                },
                                data: {id: id,...memberData}
                            }
                        )),
                    },
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
        expect(teams).toEqual([
            {
                id: 1,
                voyageId: 1,
                name: "Team 1",
            },
            {
                id: 2,
                voyageId: 1,
                name: "Team 2",
            },
            {
                id: 3,
                voyageId: 2,
                name: "Team 3",
            },
        ]);
    });
    it("should return an array of teams by voyage id", async () => {
        const voyageId = 1;
        const teams = await controller.findTeamsByVoyageId(voyageId);

        expect(teams).toEqual([
            {
                voyageId: voyageId,
                name: "Team Alpha",
            },
            {
                voyageId: voyageId,
                name: "Team Omega",
            },
        ]);
    });

    it("should return a team", async () => {
        const voyageId = 20;
        const team = await controller.findOne(voyageId);

        expect(team).toEqual({
            voyageId: voyageId,
            name: `Team ${voyageId}`,
        });
    });

    it("should return an array of team members", async () => {
        const voyageId = 1;
        const teamMembers = await controller.findTeamMembersByTeamId(voyageId);

        expect(teamMembers).toEqual([
            {
                member: {
                    firstName: "John",
                    lastName: "Doe",
                    avatar: "https://i.imgur.com/1.jpg",
                    discordId: "123456789",
                    countryCode: "US",
                    timezone: "America/New_York",
                    email: "johndoe@user.io",
                },
                hrPerSprint: 10,
                voyageRole: {
                    name: "Developer",
                },
                voyageTeamId: voyageId,
            },
            {
                member: {
                    firstName: "Jane",
                    lastName: "Smith",
                    avatar: "https://i.imgur.com/2.jpg",
                    discordId: "987654321",
                    countryCode: "US",
                    timezone: "America/New_York",
                    email: "janesmith@user.io",
                },
                hrPerSprint: 2,
                voyageRole: {
                    name: "Data Scientist",
                },
                voyageTeamId: voyageId,
            },
            {
                member: {
                    firstName: "John",
                    lastName: "Smith",
                    avatar: "https://i.imgur.com/3.jpg",
                    discordId: "123498765",
                    countryCode: "US",
                    timezone: "America/New_York",
                    email: "johnsmith@user.io",
                },
                hrPerSprint: 20,
                voyageRole: {
                    name: "UI/UX Designer",
                },
                voyageTeamId: voyageId,
            },
        ]);
    });
    it("should update a team member", async () => {
        const teamId = 1;
        const userId = "111";
        const updateTeamMemberDto = {
            hrPerSprint: 10
        };
        const updatedTeamMember = await controller.update(
            teamId,
            userId,
            updateTeamMemberDto
        );

        expect(updatedTeamMember).toEqual(
            {
                where: {
                    userVoyageId: {
                        userId: userId,
                        voyageTeamId: teamId,
                    },
                },
                data: {id: teamId,...updateTeamMemberDto}
            }
        );
    });
});
