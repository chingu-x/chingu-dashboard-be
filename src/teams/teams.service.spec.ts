import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { toBeArray } from "jest-extended";
import { TeamsService } from "./teams.service";
import { PrismaService } from "@/prisma/prisma.service";
import { prismaMock } from "@/prisma/singleton";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { CustomRequest } from "@/global/types/CustomRequest";
import { publicVoyageTeamUserSelect } from "@/global/selects/teams.select";

expect.extend({ toBeArray });

const mockVoyageTeams = [
    {
        id: 1,
        voyageId: 1,
        name: "v47-tier2-team-4",
        statusId: 1,
        repoUrl:
            "https://github.com/chingu-voyages/soloproject-tier3-chinguweather",
        repoUrlBE: "https://github.com/chingu-voyages/Handbook",
        deployedUrl: "https://www.chingu.io/",
        deployedUrlBE:
            "https://stackoverflow.com/questions/4848964/difference-between-text-and-varchar-character-varying",
        tierId: 1,
        hasSelectedDefaultProject: true,
        endDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    } as any,
];

const mockVoyage = {
    id: 1,
    number: "3",
    status: null,
    statusId: 3,
    startDate: new Date(),
    endDate: new Date(),
    soloProjectDeadline: new Date(),
    certificateIssueDate: new Date(),
    showcasePublishDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    voyageTeams: [],
    sprints: [],
    voyageApplications: [],
} as any;

const userReq = {
    userId: "aa9d050e-5756-4c3c-bc04-071f39f53663",
    email: "test@test.com",
    roles: ["admin"],
    isVerified: true,
    voyageTeams: [1],
};

const customReq = {
    user: userReq,
} as any as CustomRequest;

const updateTeamMemberDto = {
    hrPerSprint: 10,
} as UpdateTeamMemberDto;

const mockTeamMemberUpdate = {
    id: 1,
    userId: "aa9d050e-5756-4c3c-bc04-071f39f53663",
    voyageTeamId: 1,
    voyageRoleId: 2,
    statusId: 3,
    hrPerSprint: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe("TeamsService", () => {
    let service: TeamsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TeamsService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = module.get<TeamsService>(TeamsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findAll", () => {
        it("should get array of all voyage teams", async () => {
            prismaMock.voyageTeam.findMany.mockResolvedValue(mockVoyageTeams);

            const result = await service.findAll();
            expect(result).toBeArray();
            expect(result).toEqual(mockVoyageTeams);

            expect(prismaMock.voyageTeam.findMany).toHaveBeenCalled();
        });
    });

    describe("findTeamsByVoyageId", () => {
        it("should get team array by id", async () => {
            prismaMock.voyage.findUnique.mockResolvedValue(mockVoyage);
            prismaMock.voyageTeam.findMany.mockResolvedValue(mockVoyageTeams);
            const voyageId = 1;

            const result = await service.findTeamsByVoyageId(voyageId);
            expect(result).toBeArray();
            expect(result).toEqual(mockVoyageTeams);

            expect(prismaMock.voyage.findUnique).toHaveBeenCalledWith({
                where: { id: mockVoyage.id },
            });

            expect(prismaMock.voyageTeam.findMany).toHaveBeenCalledWith({
                where: { voyageId: voyageId },
                select: publicVoyageTeamUserSelect,
            });
        });

        it("should throw NotFoundException if team is not found", async () => {
            prismaMock.voyageTeam.findUnique.mockResolvedValue(null);

            await expect(service.findTeamsByVoyageId(1)).rejects.toThrow(
                new NotFoundException("Voyage with id 1 does not exist."),
            );
        });
    });

    describe("findteamById", () => {
        it("should get team by id", async () => {
            prismaMock.voyageTeam.findUnique.mockResolvedValue(
                mockVoyageTeams[0],
            );
            const teamId = 1;

            expect(
                await service.findTeamById(teamId, {
                    ...userReq,
                    voyageTeams: [1] as any,
                }),
            ).toEqual(mockVoyageTeams[0]);

            expect(prismaMock.voyageTeam.findUnique).toHaveBeenCalledWith({
                where: { id: teamId },
                select: publicVoyageTeamUserSelect,
            });
        });

        it("should throw NotFoundException if team is not found", async () => {
            const teamId = 999;
            prismaMock.voyageTeam.findUnique.mockResolvedValue(null);

            await expect(
                service.findTeamById(teamId, {
                    ...userReq,
                    voyageTeams: [1] as any,
                }),
            ).rejects.toThrow(
                new NotFoundException(
                    `Voyage team (teamId: ${teamId}) does not exist.`,
                ),
            );
        });
    });

    describe("updateTeamMemberById", () => {
        it("should update team member hrPerSprint", async () => {
            prismaMock.voyage.findUnique.mockResolvedValue(mockVoyage);
            prismaMock.voyageTeamMember.update.mockResolvedValue(
                mockTeamMemberUpdate,
            );
            prismaMock.voyageTeam.findUnique.mockResolvedValue(
                mockVoyageTeams[0],
            );

            expect(
                await service.updateTeamMemberById(
                    1,
                    customReq,
                    updateTeamMemberDto,
                ),
            ).toEqual(mockTeamMemberUpdate);

            expect(prismaMock.voyageTeamMember.update).toHaveBeenCalledWith({
                where: {
                    userVoyageId: {
                        userId: userReq.userId,
                        voyageTeamId: mockVoyageTeams[0].id,
                    },
                },
                data: updateTeamMemberDto,
            });
        });
    });
});
