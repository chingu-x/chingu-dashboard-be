import { Test, TestingModule } from "@nestjs/testing";
import { DevelopmentController } from "./development.controller";
import { DevelopmentService } from "./development.service";
import { Response } from "express";
import { AppConfigService } from "@/config/app/appConfig.service";

describe("DevelopmentController", () => {
    let controller: DevelopmentController;
    let config: AppConfigService;
    const responseMock = {} as unknown as Response;

    const mockDevelopmentService = {
        reseedDatabase: jest.fn((_responseMock) => {
            return {
                message: "Mock success message",
            };
        }),
    };
    const mockAppConfigService = {};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DevelopmentController],
            providers: [DevelopmentService, AppConfigService],
        })
            .overrideProvider(DevelopmentService)
            .useValue(mockDevelopmentService)
            .overrideProvider(AppConfigService)
            .useValue(mockAppConfigService)
            .compile();
        config = module.get<AppConfigService>(AppConfigService);
        controller = module.get<DevelopmentController>(DevelopmentController);
    });

    it("development controller should be defined", () => {
        expect(controller).toBeDefined();
    });
    it("appConfigService should be defined", () => {
        expect(config).toBeDefined();
    });

    describe("reseed database", () => {
        it("reedDatabase service should be defined", async () => {
            expect(controller.reseedDatabase).toBeDefined();
        });

        it("should reseed the database", async () => {
            Object.defineProperty(config, "nodeEnv", {
                get: jest.fn().mockReturnValue("development"),
            });
            expect(await controller.reseedDatabase(responseMock)).toEqual({
                message: "Mock success message",
            });

            expect(mockDevelopmentService.reseedDatabase).toHaveBeenCalledWith(
                responseMock,
            );
        });
    });
});
