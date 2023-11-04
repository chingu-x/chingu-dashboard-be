import { Test, TestingModule } from "@nestjs/testing";
import { TeamsService } from "./teams.service";
import { PrismaService } from "../prisma/prisma.service";

describe("TeamsService", () => {
    let service: TeamsService;

    const teamArr = [
        { id: 1, voyageId: 1, name: "Team 1" },
        { id: 2, voyageId: 1, name: "Team 2" },
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
    ];

    const teamOne = teamArr[0];
    const memberOne = memberArr[0];

    const db = {
        voyageTeam: {
            findMany: jest.fn().mockResolvedValue(teamArr),
            findUnique: jest.fn().mockResolvedValue(teamOne),
        },
        voyageTeamMember: {
            findMany: jest.fn().mockResolvedValue(memberArr),
            update: jest.fn().mockResolvedValue(memberOne),
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

            expect(teams).toEqual(teamArr);
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

            expect(members).toEqual(memberArr);
        });
    });

    describe("updateTeamMemberById", () => {
        it("should update a team member by id", async () => {
            const teamId = 1;
            const userId = "00a10ade-7308-11ee-b962-0242ac120002";
            const updateTeamMemberDto = {
                hrPerSprint: 12,
            };
            const member = await service.updateTeamMemberById(
                teamId,
                userId,
                updateTeamMemberDto,
            );

            expect(member).toEqual(memberOne);
        });
    });
});
