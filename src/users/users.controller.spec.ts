import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CustomRequest } from "src/global/types/CustomRequest";
import { UserLookupByEmailDto } from "./dto/lookup-user-by-email.dto";
import { toBeArray } from "jest-extended";
import { UnauthorizedException, NotFoundException } from "@nestjs/common";
import { PrivateUserResponse } from "./users.response";

expect.extend({ toBeArray });

describe("UsersController", () => {
    let controller: UsersController;

    const usersArr = [
        {
            id: "55e03658-7fa8-4815-b4d2-942d2eec1dfb",
            email: "johndoe@example.com",
            password: "password",
            roles: ["user"],
            isVerified: true,
        },
        {
            id: "27fc995b-040d-415b-a27c-5220f5f00c952",
            email: "janedoe@example.com",
            password: "password",
            role: ["admin"],
            isVerified: false,
        },
    ];

    const userOne = usersArr[0];
    const userOneId = userOne.id;

    const customRequestMock = {
        user: userOne,
    } as unknown as CustomRequest;

    const LookupEmailDtoMock = {
        email: userOne.email,
    } as UserLookupByEmailDto;

    const mockUsersService = {
        findAll: jest.fn().mockResolvedValue(usersArr),
        getProfile: jest.fn().mockResolvedValue(userOne),
        getUserDetailsById: jest.fn().mockResolvedValue(userOne),
        getUserDetailsByEmail: jest.fn().mockResolvedValue(userOne),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService],
        })
            .overrideProvider(UsersService)
            .useValue(mockUsersService)
            .compile();

        controller = module.get<UsersController>(UsersController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("findAll", () => {
        it("findAll service should be defined", async () => {
            expect(controller.findAll).toBeDefined();
        });

        it("should return all users", async () => {
            const result = await controller.findAll();
            expect(result).toHaveLength(2);
            expect(result).toBeArray();
            expect(result).toContainEqual({
                id: expect.any(String),
                email: expect.any(String),
                password: expect.any(String),
                roles: expect.any(Array),
                isVerified: expect.any(Boolean),
            });

            expect(mockUsersService.findAll).toHaveBeenCalled();
        });
    });
    //TODO: getprofile
    describe("getProfile", () => {
        it("getProfile service should be defined", async () => {
            expect(controller.getProfile).toBeDefined();
        });

        it("should return user profile if user is found", async () => {
            const mockUserProfile: PrivateUserResponse = {
                ...userOne,
                voyageTeamMembers: [
                    {
                        id: 1,
                        voyageTeamId: 1,
                        voyageTeam: {
                            id: 1,
                            name: "Team 1",
                            description: "Description of Team 1",
                            voyage: {
                                id: 1,
                                name: "Voyage 1",
                                description: "Description of Voyage 1",
                                status: {
                                    id: 1,
                                    name: "Active",
                                },
                            },
                        },
                        voyageRole: "member",
                    },
                ],
            };
            mockUsersService.getProfile.mockResolvedValueOnce(mockUserProfile);
            const result = await controller.getProfile(customRequestMock);
            expect(result).toEqual(mockUserProfile);
            expect(mockUsersService.getProfile).toHaveBeenCalledWith(
                customRequestMock,
            );
        });

        it("should return unauthorized if user is not logged in", async () => {
            await expect(
                controller.getProfile({ user: undefined } as any),
            ).rejects.toThrow(new UnauthorizedException());
        });

        it("should return 'not found' if user is not found", async () => {
            mockUsersService.getProfile.mockResolvedValueOnce(null);
            await expect(
                controller.getProfile(customRequestMock),
            ).rejects.toThrow(new NotFoundException());
            expect(mockUsersService.getProfile).toHaveBeenCalledWith(
                customRequestMock,
            );
        });
    });

    describe("getUserDetailsById", () => {
        it("getUserDetailsById service should be defined", async () => {
            expect(controller.getUserDetailsById).toBeDefined();
        });

        it("should return the user's profile based on the userId", async () => {
            const result = await controller.getUserDetailsById(userOneId);
            expect(result).toEqual(userOne);
            expect(mockUsersService.getUserDetailsById).toHaveBeenCalledWith(
                userOneId,
            );
        });
        it("should return 'bad request' if userId is not a UUID", async () => {
            const BadUserId = "not a uuid";
            try {
                await controller.getUserDetailsById(BadUserId as string);
            } catch (error) {
                expect(error.status).toBe(400);
                expect(error.message).toBe(`${BadUserId} is not a valid UUID.`);
            }
        });
    });

    describe("getUserDetailsByEmail", () => {
        it("getUserDetailsByEmail service should be defined", async () => {
            expect(controller.getUserDetailsByEmail).toBeDefined();
        });

        it("should return the user's profile based on the email", async () => {
            const result =
                await controller.getUserDetailsByEmail(LookupEmailDtoMock);
            expect(result).toEqual(userOne);
            expect(mockUsersService.getUserDetailsByEmail).toHaveBeenCalledWith(
                LookupEmailDtoMock,
            );
        });
        it("should return 404 if user not found", async () => {
            mockUsersService.getUserDetailsByEmail.mockResolvedValueOnce(null);

            try {
                await controller.getUserDetailsByEmail(LookupEmailDtoMock);
            } catch (error) {
                expect(error.status).toBe(404);
                expect(error.message).toBe("User not found");
            }
        });
    });
});
