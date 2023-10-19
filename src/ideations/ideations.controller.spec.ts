import { Test, TestingModule } from "@nestjs/testing";
import { IdeationsController } from "./ideations.controller";
import { IdeationsService } from "./ideations.service";

describe("IdeationsController", () => {
    let controller: IdeationsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [IdeationsController],
            providers: [IdeationsService],
        }).compile();

        controller = module.get<IdeationsController>(IdeationsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
