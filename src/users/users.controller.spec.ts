import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { toBeArray } from "jest-extended";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CustomRequest } from "src/global/types/CustomRequest";
import { UserLookupByEmailDto } from "./dto/lookup-user-by-email.dto";

expect.extend({ toBeArray });

describe("UsersController", () => {
    let controller: UsersController;
    let usersService: UsersService;
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

    const LookupEmailDtoMock = {
        email: userOne.email,
    } as UserLookupByEmailDto;

    const mockUsersService = {
        findAll: jest.fn(),
        getProfile: jest.fn(),
        getPrivateUserProfile: jest.fn(),
        getUserDetailsById: jest.fn(),
        getUserDetailsByEmail: jest.fn(),
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
        usersService = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("findAll", () => {
        it("findAll service should be defined", async () => {
            expect(controller.findAll).toBeDefined();
        });

        it("should return an array of all users", async () => {
            (usersService.findAll as jest.Mock).mockResolvedValueOnce(usersArr);
            const result = await controller.findAll();
            expect(usersService.findAll).toHaveBeenCalled();
            expect(result).toBeArray();
            expect(result).toEqual(usersArr);
        });
    });

    describe("getProfile", () => {
        it("getProfile service should be defined", async () => {
            expect(controller.getProfile).toBeDefined();
        });

        it("should return unauthorized if user is not logged in", async () => {
            mockUsersService.getPrivateUserProfile.mockRejectedValueOnce(
                new UnauthorizedException(),
            );
            const req: any = {
                user: {},
                cookies: {},
                signedCookies: {},
                get: jest.fn(),
                header: jest.fn(),
            };
            await expect(controller.getProfile(req)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it("should return 'not found' if user is not found", async () => {
            mockUsersService.getPrivateUserProfile.mockResolvedValueOnce(null);
            const req: Partial<CustomRequest> = {
                user: {
                    userId: "123",
                    email: "test@example.com",
                    roles: ["user"],
                    isVerified: false,
                    voyageTeams: [],
                },
                cookies: {},
                signedCookies: {},
                get: jest.fn(),
                header: jest.fn(),
            };

            await expect(
                controller.getProfile(req as CustomRequest),
            ).resolves.toBeNull();
            expect(mockUsersService.getPrivateUserProfile).toHaveBeenCalledWith(
                req.user!.userId,
            );
        });
    });

    describe("getUserDetailsById", () => {
        it("getUserDetailsById service should be defined", async () => {
            expect(controller.getUserDetailsById).toBeDefined();
        });

        it("should return the user's profile based on the userId", async () => {
            mockUsersService.getUserDetailsById.mockResolvedValueOnce(userOne);
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
            mockUsersService.getUserDetailsByEmail.mockResolvedValueOnce(
                userOne,
            );
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
