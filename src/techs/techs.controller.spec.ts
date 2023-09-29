import { Test, TestingModule } from "@nestjs/testing";
import { TechsController } from "./techs.controller";
import { TechsService } from "./techs.service";

describe("TechsController", () => {
    let controller: TechsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TechsController],
            providers: [TechsService],
        }).compile();

        controller = module.get<TechsController>(TechsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
