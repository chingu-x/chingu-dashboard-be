import { Test, TestingModule } from "@nestjs/testing";
import { DevelopmentController } from "./development.controller";
import { DevelopmentService } from "./development.service";

describe("DevelopmentController", () => {
    let controller: DevelopmentController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DevelopmentController],
            providers: [DevelopmentService],
        }).compile();

        controller = module.get<DevelopmentController>(DevelopmentController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
