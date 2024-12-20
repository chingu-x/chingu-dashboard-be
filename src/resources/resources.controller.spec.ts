import { Test, TestingModule } from "@nestjs/testing";
import { ResourcesController } from "./resources.controller";
import { ResourcesService } from "./resources.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { CustomRequest } from "@/global/types/CustomRequest";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { toBeArray } from "jest-extended";

expect.extend({ toBeArray });

const requestMock = {} as unknown as CustomRequest;
const dtoCreateMock = {
    url: "https://chingu.com",
    title: "Chingu",
} as CreateResourceDto;

//inavlid team id constant
const invalidTeamId = 9999;

// dto for updating a resource url
const dtoUpdateMock = {
    url: "https://chingu-2.com",
} as UpdateResourceDto;
const mockTeamId: number = 1;

const mockResource = {
    id: 1,
    url: "https://chingu.com",
    title: "Chingu",
    teamMemberId: 1,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
};

const mockUpdatedResource = {
    ...mockResource,
    url: "https://chingu-2.com",
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

const mockResourcesService = {
    createNewResource: jest.fn(),
    findAllResources: jest.fn(),
    updateResource: jest.fn(),
    removeResource: jest.fn(),
};

describe("ResourcesController", () => {
    let controller: ResourcesController;

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
                mockResource,
            );

            const result = await controller.createNewResource(
                requestMock,
                mockTeamId,
                dtoCreateMock,
            );

            expect(result).toEqual(mockResource);
            expect(mockResourcesService.createNewResource).toHaveBeenCalledWith(
                requestMock,
                dtoCreateMock,
                mockTeamId,
            );
        });
        it("should throw badRequest exception for invalid dto", async () => {
            mockResourcesService.createNewResource.mockRejectedValueOnce(
                new BadRequestException(),
            );
            await expect(
                controller.createNewResource(requestMock, mockTeamId, {
                    url: "https://chingu.com",
                } as CreateResourceDto),
            ).rejects.toThrow(BadRequestException);
            expect(mockResourcesService.createNewResource).toHaveBeenCalledWith(
                requestMock,
                dtoCreateMock,
                mockTeamId,
            );
        });
        it("should throw notFound exception for invalid teamId", async () => {
            mockResourcesService.createNewResource.mockRejectedValueOnce(
                new NotFoundException(),
            );
            await expect(
                controller.createNewResource(requestMock, 9999, dtoCreateMock),
            ).rejects.toThrow(NotFoundException);
            expect(mockResourcesService.createNewResource).toHaveBeenCalledWith(
                requestMock,
                dtoCreateMock,
                invalidTeamId,
            );
        });
    });
    describe("findAllResources", () => {
        it("findAllResources service should be defined", async () => {
            expect(controller.findAllResources).toBeDefined();
        });

        it("should find all resources", async () => {
            mockResourcesService.findAllResources.mockResolvedValueOnce(
                mockResourceArr,
            );

            const result = await controller.findAllResources(
                requestMock,
                mockTeamId,
            );

            expect(result).toBeArray();
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
            expect(mockResourcesService.findAllResources).toHaveBeenCalledWith(
                requestMock,
                mockTeamId,
            );
        });
        it("should throw notFound exception for invalid teamId", async () => {
            mockResourcesService.findAllResources.mockRejectedValueOnce(
                new NotFoundException(),
            );
            await expect(
                controller.findAllResources(requestMock, invalidTeamId),
            ).rejects.toThrow(NotFoundException);
            expect(mockResourcesService.findAllResources).toHaveBeenCalledWith(
                requestMock,
                invalidTeamId,
            );
        });
    });
    describe("Update Resource", () => {
        it("updateResource service should be defined", async () => {
            expect(controller.updateResource).toBeDefined();
        });

        it("should update a resource", async () => {
            mockResourcesService.updateResource.mockResolvedValueOnce(
                mockUpdatedResource,
            );

            const result = await controller.updateResource(
                requestMock,
                mockResource.id,
                dtoUpdateMock,
            );

            expect(result).toEqual(mockUpdatedResource);
            expect(mockResourcesService.updateResource).toHaveBeenCalledWith(
                requestMock,
                mockResource.id,
                dtoUpdateMock,
            );
        });
        it("should throw notFound exception for invalid resourceId", async () => {
            mockResourcesService.updateResource.mockRejectedValueOnce(
                new NotFoundException(),
            );
            await expect(
                controller.updateResource(
                    requestMock,
                    invalidTeamId,
                    dtoUpdateMock,
                ),
            ).rejects.toThrow(NotFoundException);
            expect(mockResourcesService.updateResource).toHaveBeenCalledWith(
                requestMock,
                invalidTeamId,
                dtoUpdateMock,
            );
        });
    });

    describe("Remove Resource", () => {
        it("removeResource service should be defined", async () => {
            expect(controller.removeResource).toBeDefined();
        });

        it("should delete a resource", async () => {
            mockResourcesService.removeResource.mockResolvedValueOnce(
                mockResource,
            );

            const result = await controller.removeResource(requestMock, 1);

            expect(result).toEqual(mockResource);
            expect(mockResourcesService.removeResource).toHaveBeenCalledWith(
                requestMock,
                mockResource.id,
            );
        });
        it("should throw notFound exception for invalid resourceId", async () => {
            mockResourcesService.removeResource.mockRejectedValueOnce(
                new NotFoundException(),
            );
            await expect(
                controller.removeResource(requestMock, invalidTeamId),
            ).rejects.toThrow(NotFoundException);
            expect(mockResourcesService.removeResource).toHaveBeenCalledWith(
                requestMock,
                invalidTeamId,
            );
        });
    });
});
