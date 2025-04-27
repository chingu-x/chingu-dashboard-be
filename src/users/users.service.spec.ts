import { Test, TestingModule } from "@nestjs/testing";
import { toBeArray } from "jest-extended";
import { NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { UsersService } from "./users.service";
import { PrismaService } from "@/prisma/prisma.service";
import { prismaMock } from "@/prisma/singleton";
import {
    fullUserDetailSelect,
    privateUserDetailSelect,
} from "@/global/selects/users.select";
import { GlobalService } from "@/global/global.service";

// Extend Jest with custom matchers
expect.extend({ toBeArray });

describe("UsersService", () => {
    let usersService: UsersService;
    let formatUserSpy: jest.SpyInstance;

    const users: User[] = [
        {
            id: "d31315ef-93c8-488f-a3f6-cb2df0016738",
            email: "jessica.williamson@gmail.com",
            password: "password",
            emailVerified: true,
            firstName: "Jessica",
            lastName: "Williamson",
            hasCompletedAssessment: true,
            avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=robohash&r=x",
            timezone: "Australia/Melbourne",
            countryCode: "AU",
            genderId: 1,
            comment: "some comment",
            refreshToken: ["refresh-token"],
            updatedAt: new Date(),
            createdAt: new Date(),
            userApplicationId: null,
        },
    ];
    const userOne = users[0];
    const email = userOne.email;

    const mockGlobalService = {
        responseDtoToArray: jest.fn((_dtoMock) => {
            return [_dtoMock.responses];
        }),
    };

    beforeEach(async () => {
        // Create a testing module with necessary providers
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
                {
                    provide: GlobalService,
                    useValue: mockGlobalService,
                },
            ],
        }).compile();

        // Get an instance of UsersService
        usersService = module.get<UsersService>(UsersService);

        // Spy on the formatUser method
        formatUserSpy = jest.spyOn(usersService as any, "formatUser");
    });
    afterEach(() => {
        // Restore the original implementation of formatUser
        formatUserSpy.mockRestore();
    });

    it("should be defined", () => {
        expect(usersService).toBeDefined();
    });

    describe("findUserByEmail", () => {
        it("should be defined", () => {
            expect(usersService.findUserByEmail).toBeDefined();
        });
        it("should return a user by email", async () => {
            prismaMock.user.findUnique.mockResolvedValue(userOne);

            const result = await usersService.findUserByEmail(email);
            expect(result).toEqual(userOne);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { email },
            });
        });
    });

    describe("findUserById", () => {
        it("should be defined", () => {
            expect(usersService.findUserById).toBeDefined();
        });
        it("should return a user by id", async () => {
            prismaMock.user.findUnique.mockResolvedValue(userOne);

            const result = await usersService.findUserById(userOne.id);
            expect(result).toEqual(userOne);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: userOne.id },
            });
        });
    });

    describe("getUserRolesById", () => {
        it("should be defined", () => {
            expect(usersService.getUserRolesById).toBeDefined();
        });
        it("should return user roles by id when user exists", async () => {
            const userWithRoles = {
                ...userOne,
                roles: [{ role: { name: "admin" } }],
            };
            prismaMock.user.findUnique.mockResolvedValue(userWithRoles);
            const result = await usersService.getUserRolesById(userOne.id);
            expect(result.roles).toEqual(["admin"]);
            expect(formatUserSpy).toHaveBeenCalledWith(userWithRoles);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: userOne.id },
                select: {
                    roles: { select: { role: { select: { name: true } } } },
                    voyageTeamMembers: {
                        select: { id: true, voyageTeamId: true },
                    },
                    emailVerified: true,
                },
            });
        });
        it("should return undefined if userId does not exist", async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);
            const result =
                await usersService.getUserRolesById("inexistentUserId");
            expect(result).toBeUndefined();
            expect(formatUserSpy).not.toHaveBeenCalledWith();
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: "inexistentUserId" },
                select: {
                    roles: { select: { role: { select: { name: true } } } },
                    voyageTeamMembers: {
                        select: { id: true, voyageTeamId: true },
                    },
                    emailVerified: true,
                },
            });
        });
    });
    describe("findAll", () => {
        it("should be defined", () => {
            expect(usersService.findAll).toBeDefined();
        });
        it("should return all users with full details", async () => {
            const usersWithRoles = users.map((user) => {
                return {
                    ...user,
                    roles: [{ role: { name: "admin" } }],
                };
            });
            const expectedUsersWithRoles = usersWithRoles.map((user) => {
                return {
                    ...user,
                    roles: ["admin"],
                };
            });
            prismaMock.user.findMany.mockResolvedValue(usersWithRoles);

            const result = await usersService.findAll();

            expect(result).toBeArray();
            expect(result).toEqual(expectedUsersWithRoles);
            expect(prismaMock.user.findMany).toHaveBeenCalledWith({
                select: fullUserDetailSelect,
            });
        });
    });

    describe("getPrivateUserProfile", () => {
        it("should be defined", () => {
            expect(usersService.getPrivateUserProfile).toBeDefined();
        });
        it("should throw NotFoundException if user is not found", async () => {
            const userId = "nonexistent-user-id";

            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(
                usersService.getPrivateUserProfile(userId),
            ).rejects.toThrow(new NotFoundException("User not found"));
        });
        it("should return user profile with updated details if user is found", async () => {
            const userId = userOne.id;
            const mockUser = {
                ...userOne,
                voyageTeamMembers: [
                    {
                        id: 1,
                        voyageTeam: {
                            FormResponseVoyageProject: true,
                        },
                    },
                    {
                        id: 2,
                        voyageTeam: {
                            FormResponseVoyageProject: false,
                        },
                    },
                ],
                soloProjects: [
                    {
                        id: 1,
                        status: {
                            status: "Passed",
                        },
                    },
                ],
            };
            const mockSprintCheckIns = [
                {
                    id: 1,
                    voyageTeamMemberId: 1,
                    sprintId: 101,
                    adminComments: null,
                    feedbackSent: false,
                    responseGroupId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    voyageTeamMemberId: 2,
                    sprintId: 102,
                    adminComments: null,
                    feedbackSent: false,
                    responseGroupId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            const expectedUpdatedUser = {
                ...mockUser,
                sprintCheckIn: [101, 102],
                voyageTeamMembers: [
                    {
                        id: 1,
                        voyageTeam: {
                            FormResponseVoyageProject: true,
                            projectSubmitted: true,
                        },
                    },
                    {
                        id: 2,
                        voyageTeam: {
                            FormResponseVoyageProject: false,
                            projectSubmitted: false,
                        },
                    },
                ],
                soloProjects: [
                    {
                        id: 1,
                        status: "Passed",
                    },
                ],
            };
            prismaMock.user.findUnique.mockResolvedValue(mockUser);
            prismaMock.formResponseCheckin.findMany.mockResolvedValue(
                mockSprintCheckIns,
            );
            formatUserSpy.mockReturnValue(expectedUpdatedUser);

            const result = await usersService.getPrivateUserProfile(userId);
            expect(result).toEqual(expectedUpdatedUser);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: userId },
                select: privateUserDetailSelect,
            });
            expect(
                prismaMock.formResponseCheckin.findMany,
            ).toHaveBeenCalledWith({
                where: { voyageTeamMemberId: { in: [1, 2] } },
                select: { sprintId: true },
            });
            expect(formatUserSpy).toHaveBeenCalledWith(expectedUpdatedUser);
        });
    });

    describe("getUserDetailsById", () => {
        it("should be defined", () => {
            expect(usersService.getUserDetailsById).toBeDefined();
        });
        it("should throw NotFoundException if user not found", async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(
                usersService.getUserDetailsById(userOne.id),
            ).rejects.toThrow(NotFoundException);
        });

        it("should return user details wih sprint check-ins IDs and project submission status", async () => {
            const mockUser = {
                ...userOne,
                voyageTeamMembers: [
                    {
                        id: 1,
                        voyageTeam: {
                            FormResponseVoyageProject: true,
                        },
                    },
                    {
                        id: 2,
                        voyageTeam: {
                            FormResponseVoyageProject: false,
                        },
                    },
                ],
            };
            const mockUserWithRoles = {
                ...mockUser,
                roles: [{ role: { name: "admin" } }],
            };
            const mockSprintCheckIns = [
                {
                    id: 1,
                    voyageTeamMemberId: 1,
                    sprintId: 101,
                    adminComments: null,
                    feedbackSent: false,
                    responseGroupId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    voyageTeamMemberId: 2,
                    sprintId: 102,
                    adminComments: null,
                    feedbackSent: false,
                    responseGroupId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            prismaMock.user.findUnique.mockResolvedValue(mockUserWithRoles);
            prismaMock.formResponseCheckin.findMany.mockResolvedValue(
                mockSprintCheckIns,
            );
            const result = await usersService.getUserDetailsById(userOne.id);
            expect(result.email).toEqual(userOne.email);
            expect(formatUserSpy).toHaveBeenCalledWith(mockUserWithRoles);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: userOne.id },
                select: fullUserDetailSelect,
            });
        });
    });

    describe("getUserDetailsByEmail", () => {
        it("should be defined", () => {
            expect(usersService.getUserDetailsByEmail).toBeDefined();
        });

        it("should throw NotFoundException if user is not found", async () => {
            const mockDto = { email: "nonexistent@example.com" };

            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(
                usersService.getUserDetailsByEmail(mockDto),
            ).rejects.toThrow(
                new NotFoundException(`User with ${mockDto.email} not found`),
            );
        });
        it("should return user details if user is found by email", async () => {
            const mockDto = { email: "jessica.williamson@gmail.com" };
            const userWithRoles = {
                ...userOne,
                roles: [{ role: { name: "admin" } }],
            };
            const expectedUserWithRoles = {
                ...userWithRoles,
                roles: ["admin"],
            };
            prismaMock.user.findUnique.mockResolvedValue(userWithRoles);

            const result = await usersService.getUserDetailsByEmail(mockDto);

            expect(result).toEqual(expectedUserWithRoles);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { email: mockDto.email },
                select: fullUserDetailSelect,
            });
            expect(formatUserSpy).toHaveBeenCalledWith(userWithRoles);
        });
    });
});
