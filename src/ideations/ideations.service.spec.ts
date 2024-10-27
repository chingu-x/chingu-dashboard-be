import { Test, TestingModule } from "@nestjs/testing";
import { IdeationsService } from "./ideations.service";
import { PrismaService } from "@/prisma/prisma.service";
import { GlobalService } from "@/global/global.service";
import { CustomRequest } from "@/global/types/CustomRequest";
import * as IdeationAbility from "@/ability/conditions/ideations.ability";
import * as VoyageTeamAbility from "@/ability/conditions/voyage-teams.ability";
import { prismaMock } from "@/prisma/singleton";

import { ProjectIdea, VoyageTeamMember, ProjectIdeaVote } from "@prisma/client";
import {
    ForbiddenException,
    NotFoundException,
    ConflictException,
} from "@nestjs/common";

// TODO: these tests probably need to be updated, it shouldn't use prisma, should only use prismaMock
describe("IdeationsService", () => {
    let service: IdeationsService;
    let globalService: GlobalService;
    const mockDate = new Date("2024-10-23T02:41:03.575Z");

    const ideationOne: ProjectIdea & {
        contributedBy?: VoyageTeamMember | null;
    } = {
        id: 1,
        voyageTeamMemberId: 1,
        title: "Ideation 1",
        description: "Ideation 1 description",
        vision: "Ideation 1 vision",
        isSelected: false,
        createdAt: mockDate,
        updatedAt: mockDate,

        contributedBy: {
            id: 1,
            userId: "00a10ade-7308-11ee-b962-0242ac120002",
            voyageTeamId: 1,
            voyageRoleId: null,
            statusId: null,
            hrPerSprint: 12,
            createdAt: mockDate,
            updatedAt: mockDate,
        },
    };

    const ideationArr = [ideationOne];

    const ideationVoteOne: ProjectIdeaVote = {
        id: 1,
        projectIdeaId: 1,
        voyageTeamMemberId: 1,
        createdAt: mockDate,
        updatedAt: mockDate,
    };

    const ideationVoteArr = [ideationVoteOne];

    const memberOne: VoyageTeamMember = {
        id: 1,
        userId: "00a10ade-7308-11ee-b962-0242ac120002",
        voyageTeamId: 1,
        voyageRoleId: null,
        statusId: null,
        hrPerSprint: 12,
        createdAt: mockDate,
        updatedAt: mockDate,
    };

    const memberTwo: VoyageTeamMember = {
        id: 2,
        userId: "00a10ade-7308-11ee-a962-0242ac120003",
        voyageTeamId: 1,
        voyageRoleId: null,
        statusId: null,
        hrPerSprint: 18,
        createdAt: mockDate,
        updatedAt: mockDate,
    };

    const memberArr = [memberOne, memberTwo];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IdeationsService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
                GlobalService,
            ],
        }).compile();

        service = module.get<IdeationsService>(IdeationsService);
        globalService = module.get<GlobalService>(GlobalService);

        jest.spyOn(service as any, "checkIdeationAndVotes").mockResolvedValue(
            1,
        );
        jest.mock("@/ability/conditions/ideations.ability", () => ({
            IdeationAbility: {
                manageOwnIdeationById: jest.fn(),
            },
        }));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    describe("createIdeation", () => {
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
                    roles: ["voyager"],
                },
            } as unknown as CustomRequest;
            const createIdeationDto = {
                title: "Ideation 1",
                description: "Ideation 1 description",
                vision: "Ideation 1 vision",
            };
            jest.spyOn(
                globalService as any,
                "getVoyageTeamMemberId",
            ).mockReturnValue(1);
            // Mock creating the ideation
            prismaMock.projectIdea.create.mockResolvedValue(ideationOne);

            // Mock finding the ideation for vote creation
            prismaMock.projectIdea.findUnique.mockResolvedValue({
                id: 1,
                voyageTeamMemberId: 1,
                contributedBy: {
                    voyageTeamId: teamId,
                },
            } as any);
            // Mock checking if user has voted
            prismaMock.projectIdeaVote.findMany.mockResolvedValue([]);

            // Mock creating the vote
            prismaMock.projectIdeaVote.create.mockResolvedValue(
                ideationVoteOne,
            );

            const result = await service.createIdeation(
                req,
                teamId,
                createIdeationDto,
            );
            // Verify the result
            expect(result).toEqual(ideationOne);
            // Verify that globalService was called
            expect(globalService.getVoyageTeamMemberId).toHaveBeenCalledWith(
                req,
                teamId,
            );
            // Verify project idea creation
            expect(prismaMock.projectIdea.create).toHaveBeenCalledWith({
                data: {
                    voyageTeamMemberId: 1,
                    ...createIdeationDto,
                },
            });

            // Verify vote creation
            expect(prismaMock.projectIdeaVote.create).toHaveBeenCalledWith({
                data: {
                    voyageTeamMemberId: 1,
                    projectIdeaId: 1,
                },
            });
        });
    });
    describe("createIdeationVote", () => {
        it("should create an ideation vote", async () => {
            const userId = "00a10ade-7308-11ee-a962-0242ac120002";
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
                    roles: ["voyager"],
                },
            } as unknown as CustomRequest;

            // Mock finding the ideation
            prismaMock.projectIdea.findUnique.mockResolvedValue({
                id: 1,
                voyageTeamMemberId: 1,
                contributedBy: {
                    voyageTeamId: 1,
                },
            } as any);

            // Mock checking if user has already voted (should return empty array)
            prismaMock.projectIdeaVote.findMany.mockResolvedValue([]);

            // Mock creating the vote
            const expectedVote = {
                id: 1,
                projectIdeaId: ideationId,
                voyageTeamMemberId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            };
            prismaMock.projectIdeaVote.create.mockResolvedValue(expectedVote);

            const result = await service.createIdeationVote(req, ideationId);
            // Verify the result
            expect(result).toEqual(ideationVoteOne);

            // Verify that we checked if the ideation exists
            expect(prismaMock.projectIdea.findUnique).toHaveBeenCalledWith({
                where: {
                    id: ideationId,
                },
                select: {
                    contributedBy: {
                        select: {
                            voyageTeamId: true,
                        },
                    },
                    voyageTeamMemberId: true,
                },
            });

            // Verify that we checked for existing votes
            expect(prismaMock.projectIdeaVote.findMany).toHaveBeenCalledWith({
                where: {
                    voyageTeamMemberId: {
                        in: [1],
                    },
                    projectIdeaId: ideationId,
                },
                select: {
                    id: true,
                },
            });

            // Verify vote creation
            expect(prismaMock.projectIdeaVote.create).toHaveBeenCalledWith({
                data: {
                    voyageTeamMemberId: 1,
                    projectIdeaId: ideationId,
                },
            });
        });
    });

    describe("getIdeationsByVoyageTeam", () => {
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
                roles: ["voyager"],
            },
        } as unknown as CustomRequest;

        it("should get ideations for a valid voyage team", async () => {
            // Mock checking if team exists
            prismaMock.voyageTeamMember.findFirst.mockResolvedValue({
                id: 1,
                userId,
                voyageTeamId: teamId,
                voyageRoleId: null,
                statusId: null,
                hrPerSprint: 0,
                createdAt: mockDate,
                updatedAt: mockDate,
            });
            // Mock getting team ideations with all nested data
            const mockTeamWithIdeations = [
                {
                    id: 1,
                    userId,
                    voyageTeamId: teamId,
                    voyageRoleId: null,
                    statusId: null,
                    hrPerSprint: 12,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    projectIdeas: [
                        {
                            id: 1,
                            title: "Ideation 1",
                            description: "Ideation 1 description",
                            vision: "Ideation 1 vision",
                            isSelected: false,
                            createdAt: mockDate,
                            updatedAt: mockDate,
                            contributedBy: {
                                member: {
                                    id: userId,
                                    avatar: "avatar-url",
                                    firstName: "John",
                                    lastName: "Doe",
                                },
                            },
                            projectIdeaVotes: [
                                {
                                    votedBy: {
                                        member: {
                                            id: userId,
                                            avatar: "avatar-url",
                                            firstName: "John",
                                            lastName: "Doe",
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ] as any;

            // Mock getting team ideations with all nested data
            prismaMock.voyageTeamMember.findMany.mockResolvedValue(
                mockTeamWithIdeations,
            );
            const result = await service.getIdeationsByVoyageTeam(req, teamId);

            // Verify the result
            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                id: 1,
                title: "Ideation 1",
                description: "Ideation 1 description",
                vision: "Ideation 1 vision",
                isSelected: false,
            });

            // Verify that we checked if the team exists
            expect(prismaMock.voyageTeamMember.findFirst).toHaveBeenCalledWith({
                where: {
                    voyageTeamId: teamId,
                },
            });
            // Verify the findMany call with all select options
            expect(prismaMock.voyageTeamMember.findMany).toHaveBeenCalledWith({
                where: {
                    voyageTeamId: teamId,
                },
                select: {
                    projectIdeas: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            vision: true,
                            isSelected: true,
                            createdAt: true,
                            updatedAt: true,
                            contributedBy: {
                                select: {
                                    member: {
                                        select: {
                                            id: true,
                                            avatar: true,
                                            firstName: true,
                                            lastName: true,
                                        },
                                    },
                                },
                            },
                            projectIdeaVotes: {
                                include: {
                                    votedBy: {
                                        select: {
                                            member: {
                                                select: {
                                                    id: true,
                                                    avatar: true,
                                                    firstName: true,
                                                    lastName: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        });
        it("should throw NotFoundException when team does not exist", async () => {
            // Mock that team doesn't exist
            prismaMock.voyageTeamMember.findFirst.mockResolvedValue(null);

            await expect(
                service.getIdeationsByVoyageTeam(req, teamId),
            ).rejects.toThrow(`voyageTeamId (id: ${teamId}) does not exist.`);

            // Verify that findMany was never called
            expect(prismaMock.voyageTeamMember.findMany).not.toHaveBeenCalled();
        });

        it("should return empty array when team has no ideations", async () => {
            // Mock that team exists
            prismaMock.voyageTeamMember.findFirst.mockResolvedValue({
                id: 1,
                userId,
                voyageTeamId: teamId,
                voyageRoleId: null,
                statusId: null,
                hrPerSprint: 12,
                createdAt: mockDate,
                updatedAt: mockDate,
            });

            // Mock empty ideations
            prismaMock.voyageTeamMember.findMany.mockResolvedValue([
                {
                    id: 1,
                    userId,
                    voyageTeamId: teamId,
                    voyageRoleId: null,
                    statusId: null,
                    hrPerSprint: 12,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    projectIdeas: [],
                },
            ] as any);

            const result = await service.getIdeationsByVoyageTeam(req, teamId);

            expect(result).toEqual([]);
        });
    });
    describe("updateIdeation", () => {
        const userId = "00a10ade-7308-11ee-b962-0242ac120002";
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
                roles: ["voyager"],
            },
        } as unknown as CustomRequest;
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it("should update an ideation when authorized", async () => {
            const updateIdeationDto = {
                title: "Ideation 1",
                description: "Ideation 1 description",
                vision: "Ideation 1 vision",
            };
            // Mock the authorization check
            jest.spyOn(
                IdeationAbility,
                "manageOwnIdeationById",
            ).mockResolvedValue();
            // Mock the update operation
            const updateIdeation = {
                id: ideationId,
                title: updateIdeationDto.title,
                description: updateIdeationDto.description,
                vision: updateIdeationDto.vision,
                isSelected: false,
                voyageTeamMemberId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            };
            prismaMock.projectIdea.update.mockResolvedValue(updateIdeation);

            const result = await service.updateIdeation(
                req,
                ideationId,
                updateIdeationDto,
            );
            // Verify authorization check was called
            expect(IdeationAbility.manageOwnIdeationById).toHaveBeenCalledWith(
                req.user,
                ideationId,
            );
            // Verify the update operation
            expect(prismaMock.projectIdea.update).toHaveBeenCalledWith({
                where: { id: ideationId },
                data: {
                    title: updateIdeationDto.title,
                    description: updateIdeationDto.description,
                    vision: updateIdeationDto.vision,
                },
            });
            // Verify the result
            expect(result).toEqual(updateIdeation);
        });
    });
    describe("deleteIdeationVote", () => {
        const userId = "00a10ade-7308-11ee-a962-0242ac120002";
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
                roles: ["voyager"],
            },
        } as CustomRequest;
        it("should delete an ideation vote", async () => {
            // Mock finding the vote
            prismaMock.projectIdeaVote.findFirst.mockResolvedValue({
                id: 1,
                projectIdeaId: ideationId,
                voyageTeamMemberId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            });
            // Mock deleting the vote
            prismaMock.projectIdeaVote.delete.mockResolvedValue({
                id: 1,
                projectIdeaId: ideationId,
                voyageTeamMemberId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            });
            const result = await service.deleteIdeationVote(req, ideationId);
            expect(prismaMock.projectIdeaVote.findFirst).toHaveBeenCalledWith({
                where: {
                    projectIdeaId: ideationId,
                    voyageTeamMemberId: {
                        in: [1],
                    },
                },
                select: {
                    id: true,
                },
            });

            expect(prismaMock.projectIdeaVote.delete).toHaveBeenCalledWith({
                where: {
                    id: 1,
                },
            });
            expect(result).toMatchObject({
                id: 1,
                projectIdeaId: ideationId,
                voyageTeamMemberId: 1,
            });
        });
        it("should throw BadRequestException when vote doesn't exist", async () => {
            // Mock vote not found
            prismaMock.projectIdeaVote.findFirst.mockResolvedValue(null);

            await expect(
                service.deleteIdeationVote(req, ideationId),
            ).rejects.toThrow(
                `Invalid Ideation Id or Team Member Id. The user does not have a vote for ideation id: ${ideationId}`,
            );

            expect(prismaMock.projectIdeaVote.delete).not.toHaveBeenCalled();
        });
    });
    describe("deleteIdeation", () => {
        const userId = "00a10ade-7308-11ee-b962-0242ac120002";
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
                roles: ["voyager"],
            },
        } as CustomRequest;
        let checkIdeationAndVotesSpy: jest.SpyInstance;
        let removeVoteSpy: jest.SpyInstance;
        let removeIdeationSpy: jest.SpyInstance;

        beforeEach(() => {
            // setup up spies for private methods
            checkIdeationAndVotesSpy = jest.spyOn(
                service as any,
                "checkIdeationAndVotes",
            );
            removeVoteSpy = jest.spyOn(service as any, "removeVote");
            removeIdeationSpy = jest.spyOn(service as any, "removeIdeation");
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it("should successfully delete an ideation when it has only one vote", async () => {
            // Mock checkIdeationAndVotes to return 1 vote
            checkIdeationAndVotesSpy.mockResolvedValue(1);
            // Mock removeVote
            removeVoteSpy.mockResolvedValue({
                id: 1,
                projectIdeaId: ideationId,
                voyageTeamMemberId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            });

            // Mock removeIdeation
            removeIdeationSpy.mockResolvedValue({
                id: ideationId,
                title: "Ideation 1",
                description: "Ideation 1 description",
                vision: "Ideation 1 vision",
                isSelected: false,
                voyageTeamMemberId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            });
            const result = await service.deleteIdeation(req, ideationId);

            // verify the check for votes was called
            expect(checkIdeationAndVotesSpy).toHaveBeenCalledWith(ideationId);
            expect(removeVoteSpy).toHaveBeenCalledWith(req, ideationId);
            expect(removeIdeationSpy).toHaveBeenCalledWith(ideationId);

            expect(result).toMatchObject({
                id: ideationId,
                title: "Ideation 1",
                description: "Ideation 1 description",
                vision: "Ideation 1 vision",
            });
        });

        it("should throw ConflictException when ideation has multiple votes", async () => {
            // Mock checkIdeationAndVotes to return more than 1 vote
            jest.spyOn(
                service as any,
                "checkIdeationAndVotes",
            ).mockResolvedValue(2);

            await expect(
                service.deleteIdeation(req, ideationId),
            ).rejects.toThrow(
                "Ideation cannot be deleted when others have voted for it.",
            );

            expect(prismaMock.projectIdeaVote.delete).not.toHaveBeenCalled();
            expect(prismaMock.projectIdea.delete).not.toHaveBeenCalled();
        });

        it("should throw NotFoundException when ideation doesn't exist", async () => {
            // Mock checkIdeationAndVotes to throw NotFoundException
            jest.spyOn(
                service as any,
                "checkIdeationAndVotes",
            ).mockRejectedValue(new NotFoundException());

            await expect(
                service.deleteIdeation(req, ideationId),
            ).rejects.toThrow(NotFoundException);

            expect(prismaMock.projectIdeaVote.delete).not.toHaveBeenCalled();
            expect(prismaMock.projectIdea.delete).not.toHaveBeenCalled();
        });
    });

    describe("getSelectedIdeation", () => {
        const teamId = 1;

        it("should successfully get selected ideation", async () => {
            // Mock finding team members
            prismaMock.voyageTeamMember.findMany.mockResolvedValue(memberArr);

            // Mock finding selected ideation
            prismaMock.projectIdea.findFirst.mockResolvedValue({
                id: 1,
                title: "Selected Ideation",
                description: "Description",
                vision: "Vision",
                isSelected: true,
                voyageTeamMemberId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            });

            const result = await service.getSelectedIdeation(teamId);

            // Verify team member query
            expect(prismaMock.voyageTeamMember.findMany).toHaveBeenCalledWith({
                where: {
                    voyageTeamId: teamId,
                },
                select: {
                    id: true,
                },
            });

            // Verify selected ideation query
            expect(prismaMock.projectIdea.findFirst).toHaveBeenCalledWith({
                where: {
                    voyageTeamMemberId: {
                        in: [1, 2], // should match the mocked member IDs
                    },
                    isSelected: true,
                },
            });

            // Verify the result
            expect(result).toMatchObject({
                id: 1,
                title: "Selected Ideation",
                isSelected: true,
            });
        });

        it("should return null when no selected ideation exists", async () => {
            // Mock finding team members
            prismaMock.voyageTeamMember.findMany.mockResolvedValue(memberArr);

            // Mock no selected ideation found
            prismaMock.projectIdea.findFirst.mockResolvedValue(null);

            const result = await service.getSelectedIdeation(teamId);

            expect(result).toBeNull();
            expect(prismaMock.voyageTeamMember.findMany).toHaveBeenCalled();
            expect(prismaMock.projectIdea.findFirst).toHaveBeenCalled();
        });

        it("should return null when team has no members", async () => {
            // Mock no team members found
            prismaMock.voyageTeamMember.findMany.mockResolvedValue([]);
            // Mock no selected ideation found (this would be called with an empty array of team members)
            prismaMock.projectIdea.findFirst.mockResolvedValue(null);

            const result = await service.getSelectedIdeation(teamId);

            expect(result).toBeNull();
            expect(prismaMock.voyageTeamMember.findMany).toHaveBeenCalledWith({
                where: {
                    voyageTeamId: teamId,
                },
                select: {
                    id: true,
                },
            });
            // Should not try to find ideation if no members exist
            expect(prismaMock.projectIdea.findFirst).toHaveBeenCalledWith({
                where: {
                    voyageTeamMemberId: {
                        in: [], // empty array of member IDs
                    },
                    isSelected: true,
                },
            });
        });
    });
    describe("setIdeationSelection", () => {
        let manageOwnVoyageTeamWithIdParamSpy: jest.SpyInstance;
        let getSelectedIdeationSpy: jest.SpyInstance;

        const userId = "00a10ade-7308-11ee-b962-0242ac120002";
        const teamId = 1;
        const ideationId = 1;
        const mockDate = new Date("2024-10-23T02:41:03.575Z");

        const req = {
            user: {
                userId: userId,
                voyageTeams: [
                    {
                        teamId: 1,
                        memberId: 1,
                    },
                ],
                roles: ["voyager"],
            },
        } as CustomRequest;

        beforeEach(() => {
            // setup up spies for private methods
            manageOwnVoyageTeamWithIdParamSpy = jest.spyOn(
                VoyageTeamAbility,
                "manageOwnVoyageTeamWithIdParam",
            );
            getSelectedIdeationSpy = jest.spyOn(service, "getSelectedIdeation");
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it("should successfully set ideation as selected", async () => {
            // Mock the authorization check
            manageOwnVoyageTeamWithIdParamSpy.mockImplementation(() =>
                Promise.resolve(),
            );

            // Mock getSelectedIdeation to return null (no current selection)
            getSelectedIdeationSpy.mockResolvedValue(null);

            // Mock the update operation
            const updatedIdeation = {
                id: ideationId,
                title: "Selected Ideation",
                description: "Description",
                vision: "Vision",
                isSelected: true,
                voyageTeamMemberId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            };
            prismaMock.projectIdea.update.mockResolvedValue(updatedIdeation);

            const result = await service.setIdeationSelection(
                req,
                teamId,
                ideationId,
            );

            // Verify authorization was checked
            expect(manageOwnVoyageTeamWithIdParamSpy).toHaveBeenCalledWith(
                req.user,
                teamId,
            );

            // Verify current selection was checked
            expect(getSelectedIdeationSpy).toHaveBeenCalledWith(teamId);

            // Verify update operation
            expect(prismaMock.projectIdea.update).toHaveBeenCalledWith({
                where: {
                    id: ideationId,
                },
                data: {
                    isSelected: true,
                },
            });

            expect(result).toEqual(updatedIdeation);
        });

        it("should throw ConflictException when team already has a selected ideation", async () => {
            // Mock the authorization check
            manageOwnVoyageTeamWithIdParamSpy.mockImplementation(() =>
                Promise.resolve(),
            );

            // Mock getSelectedIdeation to return an existing selection
            getSelectedIdeationSpy.mockResolvedValue({
                id: 2,
                isSelected: true,
                title: "Already Selected Ideation",
                description: "Description",
                vision: "Vision",
                voyageTeamMemberId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            });

            await expect(
                service.setIdeationSelection(req, teamId, ideationId),
            ).rejects.toThrow(`Ideation already selected for team ${teamId}`);

            // Verify update was never called
            expect(prismaMock.projectIdea.update).not.toHaveBeenCalled();
        });

        it("should throw NotFoundException when ideation does not exist", async () => {
            // Mock the authorization check
            manageOwnVoyageTeamWithIdParamSpy.mockImplementation(() =>
                Promise.resolve(),
            );

            // Mock getSelectedIdeation to return null
            getSelectedIdeationSpy.mockResolvedValue(null);

            // Mock update to throw Prisma's not found error
            prismaMock.projectIdea.update.mockRejectedValue({
                code: "P2025",
                meta: { cause: "Record not found" },
            });

            await expect(
                service.setIdeationSelection(req, teamId, 999),
            ).rejects.toThrow(NotFoundException);

            expect(prismaMock.projectIdea.update).toHaveBeenCalled();
        });

        it("should throw ForbiddenException when user is not authorized", async () => {
            // Mock the authorization check to throw
            manageOwnVoyageTeamWithIdParamSpy.mockImplementation(() => {
                throw new ForbiddenException();
            });

            await expect(
                service.setIdeationSelection(req, teamId, ideationId),
            ).rejects.toThrow(ForbiddenException);

            // Verify no other operations were attempted
            expect(getSelectedIdeationSpy).not.toHaveBeenCalled();
            expect(prismaMock.projectIdea.update).not.toHaveBeenCalled();
        });
    });

    describe("resetIdeationSelection", () => {
        let getSelectedIdeationSpy: jest.SpyInstance;

        const userId = "00a10ade-7308-11ee-b962-0242ac120002";
        const teamId = 1;
        const mockDate = new Date("2024-10-23T02:41:03.575Z");

        const req = {
            user: {
                userId: userId,
                voyageTeams: [
                    {
                        teamId: 1,
                        memberId: 1,
                    },
                ],
                roles: ["voyager"],
            },
        } as CustomRequest;

        beforeEach(async () => {
            getSelectedIdeationSpy = jest.spyOn(service, "getSelectedIdeation");
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should successfully reset ideation selection", async () => {
            // Mock finding the currently selected ideation
            const selectedIdeation = {
                id: 1,
                title: "Selected Ideation",
                description: "Description",
                vision: "Vision",
                isSelected: true,
                voyageTeamMemberId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            };
            getSelectedIdeationSpy.mockResolvedValue(selectedIdeation);

            // Mock the update operation
            const updatedIdeation = {
                ...selectedIdeation,
                isSelected: false,
            };
            prismaMock.projectIdea.update.mockResolvedValue(updatedIdeation);

            const result = await service.resetIdeationSelection(req, teamId);

            // Verify getSelectedIdeation was called
            expect(getSelectedIdeationSpy).toHaveBeenCalledWith(teamId);

            // Verify update operation
            expect(prismaMock.projectIdea.update).toHaveBeenCalledWith({
                where: {
                    id: selectedIdeation.id,
                },
                data: {
                    isSelected: false,
                },
            });

            // Verify result
            expect(result).toEqual(updatedIdeation);
            expect(result.isSelected).toBe(false);
        });

        it("should throw NotFoundException when no selected ideation exists", async () => {
            // Mock no selected ideation found
            getSelectedIdeationSpy.mockResolvedValue(null);

            await expect(
                service.resetIdeationSelection(req, teamId),
            ).rejects.toThrow(
                new NotFoundException(`no ideation found for team ${teamId}`),
            );

            // Verify getSelectedIdeation was called
            expect(getSelectedIdeationSpy).toHaveBeenCalledWith(teamId);

            // Verify update was never called
            expect(prismaMock.projectIdea.update).not.toHaveBeenCalled();
        });

        it("should throw an error when update fails", async () => {
            // Mock finding the currently selected ideation
            const selectedIdeation = {
                id: 1,
                title: "Selected Ideation",
                description: "Description",
                vision: "Vision",
                isSelected: true,
                voyageTeamMemberId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            };
            getSelectedIdeationSpy.mockResolvedValue(selectedIdeation);

            // Mock update to fail
            const error = new Error("Update failed");
            prismaMock.projectIdea.update.mockRejectedValue(error);

            await expect(
                service.resetIdeationSelection(req, teamId),
            ).rejects.toThrow(error);

            expect(getSelectedIdeationSpy).toHaveBeenCalledWith(teamId);
            expect(prismaMock.projectIdea.update).toHaveBeenCalled();
        });
    });
});
