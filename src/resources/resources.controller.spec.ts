import { Test, TestingModule } from "@nestjs/testing";
import { ResourcesController } from "./resources.controller";
import { ResourcesService } from "./resources.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { CustomRequest } from "../global/types/CustomRequest";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("ResourcesController", () => {
    let controller: ResourcesController;

    const requestMock = {} as unknown as CustomRequest;
    const dtoCreateMock = {
        url: "https://chingu.com",
        title: "Chingu",
    } as CreateResourceDto;
    const teamIdMock: number = 1;

    const singleResource = {
        id: 1,
        url: "https://chingu.com",
        title: "Chingu",
        teamMemberId: 1,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
    };
    const allResources = [
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
    const mockResourcesService = {
        createNewResource: jest.fn(),
        findAllResources: jest.fn(),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ResourcesController],
            providers: [ResourcesService],
        })
            .overrideProvider(ResourcesService)
            .useValue(mockResourcesService)
            .compile();

        controller = module.get<ResourcesController>(ResourcesController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("createNewResource", () => {
        it("createNewResource service should be defined", async () => {
            expect(controller.createNewResource).toBeDefined();
        });

        it("should create a new resource", async () => {
            mockResourcesService.createNewResource.mockResolvedValueOnce(
                singleResource,
            );

            const result = await controller.createNewResource(
                requestMock,
                teamIdMock,
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
            expect(mockResourcesService.createNewResource).toHaveBeenCalled();
            expect(mockResourcesService.createNewResource).toHaveBeenCalledWith(
                requestMock,
                dtoCreateMock,
                teamIdMock,
            );
        });
        it("should throw badRequest exception for invalid dto", async () => {
            mockResourcesService.createNewResource.mockRejectedValueOnce(
                new BadRequestException(),
            );
            expect(
                controller.createNewResource(requestMock, teamIdMock, {
                    url: "https://chingu.com",
                } as CreateResourceDto),
            ).rejects.toThrow(BadRequestException);
            expect(mockResourcesService.createNewResource).toHaveBeenCalledWith(
                requestMock,
                dtoCreateMock,
                teamIdMock,
            );
        });
        it("should throw notFound exception for invalid teamId", async () => {
            mockResourcesService.createNewResource.mockRejectedValueOnce(
                new NotFoundException(),
            );
            expect(
                controller.createNewResource(requestMock, 9999, dtoCreateMock),
            ).rejects.toThrow(NotFoundException);
            expect(mockResourcesService.createNewResource).toHaveBeenCalledWith(
                requestMock,
                dtoCreateMock,
                9999,
            );
        });
    });
    describe("findAllResources", () => {
        it("findAllResources service should be defined", async () => {
            expect(controller.findAllResources).toBeDefined();
        });

        it("should find all resources", async () => {
            mockResourcesService.findAllResources.mockResolvedValueOnce(
                allResources,
            );

            const result = await controller.findAllResources(
                requestMock,
                teamIdMock,
            );

            expect(result).toBeArray;
            expect(result).toHaveLength(2);
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
            expect(mockResourcesService.findAllResources).toHaveBeenCalled();
            expect(mockResourcesService.findAllResources).toHaveBeenCalledWith(
                requestMock,
                teamIdMock,
            );
        });
        it("should throw notFound exception for invalid teamId", async () => {
            mockResourcesService.findAllResources.mockRejectedValueOnce(
                new NotFoundException(),
            );
            expect(
                controller.findAllResources(requestMock, 9999),
            ).rejects.toThrow(NotFoundException);
            expect(mockResourcesService.findAllResources).toHaveBeenCalledWith(
                requestMock,
                9999,
            );
        });
    });
});
