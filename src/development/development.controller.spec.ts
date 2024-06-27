import { Test, TestingModule } from "@nestjs/testing";
import { DevelopmentController } from "./development.controller";
import { DevelopmentService } from "./development.service";
import * as process from "node:process";
import { CustomRequest } from "../global/types/CustomRequest";
import { Response } from "express";

describe("DevelopmentController", () => {
    let controller: DevelopmentController;

    const responseMock = {} as unknown as Response;

    const mockDevelopmentService = {
        reseedDatabase: jest.fn((_responseMock) => {
            return {
                message: "Mock success message",
            };
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DevelopmentController],
            providers: [DevelopmentService],
        })
            .overrideProvider(DevelopmentService)
            .useValue(mockDevelopmentService)
            .compile();

        controller = module.get<DevelopmentController>(DevelopmentController);
    });

    it("development controller should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("reseed database", () => {
        it("reedDatabase service should be defined", async () => {
            expect(controller.reseedDatabase).toBeDefined();
        });

        it("should reseed the database", async () => {
            expect(await controller.reseedDatabase(responseMock)).toEqual({
                message: "Mock success message",
            });

            expect(mockDevelopmentService.reseedDatabase).toHaveBeenCalledWith(
                responseMock,
            );
        });
    });
});
