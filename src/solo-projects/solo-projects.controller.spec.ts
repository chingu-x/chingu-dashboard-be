import { Test, TestingModule } from "@nestjs/testing";
import { SoloProjectsController } from "./solo-projects.controller";
import { SoloProjectsService } from "./solo-projects.service";

describe("SoloProjectsController", () => {
    let controller: SoloProjectsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SoloProjectsController],
            providers: [SoloProjectsService],
        }).compile();

        controller = module.get<SoloProjectsController>(SoloProjectsController);
    });

    xit("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
