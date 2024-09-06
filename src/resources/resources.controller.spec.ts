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
    const mockResourcesService = {
        createNewResource: jest.fn(),
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
});
