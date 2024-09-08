import { Test, TestingModule } from "@nestjs/testing";
import { ResourcesService } from "./resources.service";
import { PrismaService } from "../prisma/prisma.service";
import { GlobalService } from "../global/global.service";
import { prismaMock } from "../prisma/singleton";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { CustomRequest } from "../global/types/CustomRequest";

describe("ResourcesService", () => {
    let service: ResourcesService;

    const userReq = {
        userId: "aa9d050e-5756-4c3c-bc04-071f39f53663",
        email: "test@test.com",
        roles: ["voyager"],
        isVerified: true,
        voyageTeams: [{ teamId: 1, memberId: 1 }],
    };

    const mockTeamId: number = 1;
    const mockTeamMemberId: number = 1;

    const requestMock = {
        user: userReq,
    } as any as CustomRequest;

    const dtoCreateMock = {
        url: "https://chingu.com",
        title: "Chingu",
    } as CreateResourceDto;

    const mockResource = {
        id: 1,
        url: "https://chingu.com",
        title: "Chingu",
        teamMemberId: 1,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
    };

    const mockUpdatedResource = {
        id: 1,
        url: "https://chingu-2.com",
        title: "Chingu",
        teamMemberId: 1,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
    };

    const mockVoyageTeam = {
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
        endDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockResourceArr = [
        {
            id: 1,
            url: "https://chingu.com",
            title: "Chingu",
            teamMemberId: 1,
            addedBy: {
                member: {
                    firstName: "Larry",
                    lastName: "Castro",
                    id: "18093ad0-88ef-4bcd-bee8-322749c876bd",
                    avatar: "https://gravatar.com/avatar/90383a4ee0fb891c1ec3374e6a593a6c6fd88166d4fd45f796dabeaba7af836d?s=200&r=g&d=wavatar\n",
                },
            },
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
        },
        {
            id: 2,
            url: "https://Nestjs.com",
            title: "Nestjs",
            teamMemberId: 2,
            addedBy: {
                member: {
                    firstName: "John",
                    lastName: "Doe",
                    id: "18093ad0-88ef-4bcd-bee8-322749c876bd",
                    avatar: "https://gravatar.com/avatar/90383a4ee0fb891c1ec3374e6a593a6c6fd88166d4fd45f796dabeaba7af836d?s=200&r=g&d=wavatar\n",
                },
            },
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ResourcesService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
                GlobalService,
            ],
        }).compile();

        service = module.get<ResourcesService>(ResourcesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("createNewResource", () => {
        it("should create a resource", async () => {
            prismaMock.voyageTeam.findUnique.mockResolvedValue(mockVoyageTeam);
            prismaMock.teamResource.findFirst.mockResolvedValue(null);
            prismaMock.teamResource.create.mockResolvedValue(mockResource);

            const result = await service.createNewResource(
                requestMock,
                dtoCreateMock,
                mockTeamId,
            );
            expect(result).toEqual({
                id: expect.any(Number),
                url: expect.any(String),
                title: expect.any(String),
                teamMemberId: expect.any(Number),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });

            expect(prismaMock.voyageTeam.findUnique).toHaveBeenCalledWith({
                where: { id: mockTeamId },
            });
            expect(prismaMock.teamResource.findFirst).toHaveBeenCalledWith({
                where: {
                    url: dtoCreateMock.url,
                    addedBy: {
                        voyageTeam: {
                            id: mockTeamId,
                        },
                    },
                },
            });
            expect(prismaMock.teamResource.create).toHaveBeenCalledWith({
                data: { ...dtoCreateMock, teamMemberId: mockTeamMemberId },
            });
        });
    });

    describe("findAllResources", () => {
        it("should find all resources", async () => {
            prismaMock.voyageTeam.findUnique.mockResolvedValue(mockVoyageTeam);
            prismaMock.teamResource.findMany.mockResolvedValue(mockResourceArr);

            const result = await service.findAllResources(
                requestMock,
                mockTeamId,
            );
            expect(result[0]).toEqual({
                id: expect.any(Number),
                url: expect.any(String),
                title: expect.any(String),
                teamMemberId: expect.any(Number),
                addedBy: {
                    member: {
                        firstName: expect.any(String),
                        lastName: expect.any(String),
                        id: expect.any(String),
                        avatar: expect.any(String),
                    },
                },
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });

            expect(prismaMock.voyageTeam.findUnique).toHaveBeenCalledWith({
                where: { id: mockTeamId },
            });
            expect(prismaMock.teamResource.findMany).toHaveBeenCalledWith({
                where: {
                    addedBy: {
                        voyageTeam: {
                            id: mockTeamId,
                        },
                    },
                },
                include: {
                    addedBy: {
                        select: {
                            member: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    id: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        });
    });

    describe("updateResource", () => {
        it("should update a resource", async () => {
            prismaMock.teamResource.findUnique.mockResolvedValue(mockResource);
            prismaMock.teamResource.update.mockResolvedValue(
                mockUpdatedResource,
            );

            const result = await service.updateResource(
                requestMock,
                mockUpdatedResource.id,
                dtoCreateMock,
            );
            expect(result).toEqual({
                id: expect.any(Number),
                url: expect.any(String),
                title: expect.any(String),
                teamMemberId: expect.any(Number),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });

            expect(prismaMock.teamResource.findUnique).toHaveBeenCalledWith({
                where: {
                    id: mockUpdatedResource.id,
                },
            });
            expect(prismaMock.teamResource.update).toHaveBeenCalledWith({
                where: { id: mockUpdatedResource.id },
                data: dtoCreateMock,
            });
        });
    });

    describe("removeResource", () => {
        it("should delete a resource", async () => {
            prismaMock.teamResource.findUnique.mockResolvedValue(mockResource);
            prismaMock.teamResource.delete.mockResolvedValue(mockResource);

            const result = await service.removeResource(
                requestMock,
                mockResource.id,
            );
            expect(result).toEqual(mockResource);

            expect(prismaMock.teamResource.findUnique).toHaveBeenCalledWith({
                where: {
                    id: mockResource.id,
                },
            });
            expect(prismaMock.teamResource.delete).toHaveBeenCalledWith({
                where: {
                    id: mockResource.id,
                },
            });
        });
    });
});
