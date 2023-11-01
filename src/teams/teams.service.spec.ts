import { Test, TestingModule } from "@nestjs/testing";
import { TeamsService } from "./teams.service";
import { PrismaService } from "../prisma/prisma.service";

describe("TeamsService", () => {
    let service: TeamsService;

    const teamArr = [
        { id: 1, voyageId: 1, name: "Team 1" },
        { id: 2, voyageId: 1, name: "Team 2" },
        { id: 3, voyageId: 2, name: "Team 3" },
    ];
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
        },
        {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            userId: "00a10da4-7308-11ee-b962-0242ac120002",
            voyageTeamId: 2,
            userVoyageId: {
                voyageTeamId: 2,
                userId: "00a10da4-7308-11ee-b962-0242ac120002",
            },
            hrPerSprint: 25,
        },
        {
            id: 3,
            firstName: "John",
            lastName: "Smith",
            userId: "00a10eee-7308-11ee-b962-0242ac120002",
            voyageTeamId: 3,
            userVoyageId: {
                voyageTeamId: 3,
                userId: "00a10eee-7308-11ee-b962-0242ac120002",
            },
            hrPerSprint: 20,
        },
    ];

    const teamOne = teamArr[0];
    const memberOne = memberArr[0];

    const db = {
        voyageTeam: {
            findMany: jest.fn().mockImplementation((params) => {
                return params.where?.voyageId
                    ? teamArr.filter(
                          (team) => team.voyageId === params.where.voyageId,
                      )
                    : teamArr;
            }),
            findUnique: jest.fn().mockImplementation((params) => {
                const id = params.where.id;
                const team = teamArr.find((team) => team.voyageId === id);
                return team;
            }),
        },
        voyageTeamMember: {
            findMany: jest.fn().mockImplementation((params) => {
                const voyageTeamId = params.where.voyageTeamId;
                return memberArr.filter(
                    (member) => member.voyageTeamId === voyageTeamId,
                );
            }),
            update: jest.fn().mockImplementation((params) => {
                const userVoyageId = params.where.userVoyageId;
                let updatedMember = memberArr.find(
                    (member) =>
                        member.userVoyageId.userId === userVoyageId.userId &&
                        member.userVoyageId.voyageTeamId ===
                            userVoyageId.voyageTeamId,
                );
                updatedMember = { ...updatedMember, ...params.data };
                return updatedMember;
            }),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TeamsService,
                {
                    provide: PrismaService,
                    useValue: db,
                },
            ],
        }).compile();

        service = module.get<TeamsService>(TeamsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findAll", () => {
        it("should return an array of teams", async () => {
            const teams = await service.findAll();

            expect(teams).toEqual(teamArr);
        });
    });

    describe("findAllByVoyageId", () => {
        it("should return an array of teams by voyage id", async () => {
            const voyageId = 1;
            const teams = await service.findAllByVoyageId(voyageId);
            const filteredTeams = teamArr.filter(
                (team) => team.voyageId === voyageId,
            );

            expect(teams).toEqual(filteredTeams);
        });
    });

    describe("findOne", () => {
        it("should return a team by id", async () => {
            const id = 1;
            const team = await service.findOne(id);

            expect(team).toEqual(teamOne);
        });
    });

    describe("findTeamMembersByTeamId", () => {
        it("should return an array of team members by team id", async () => {
            const id = 1;
            const members = await service.findTeamMembersByTeamId(id);
            const filteredMembers = memberArr.filter(
                (member) => member.voyageTeamId === id,
            );

            expect(members).toEqual(filteredMembers);
        });
    });

    describe("updateTeamMemberById", () => {
        it("should update a team member by id", async () => {
            const teamId = 1;
            const userId = "00a10ade-7308-11ee-b962-0242ac120002";
            const updateTeamMemberDto = {
                hrPerSprint: 33,
            };

            const member = await service.updateTeamMemberById(
                teamId,
                userId,
                updateTeamMemberDto,
            );
            const expectedMember = {
                ...memberOne,
                ...updateTeamMemberDto,
            };

            expect(member).toEqual(expectedMember);
        });
    });
});
