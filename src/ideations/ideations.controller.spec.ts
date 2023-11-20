import { Test, TestingModule } from "@nestjs/testing";
import { IdeationsController } from "./ideations.controller";
import { IdeationsService } from "./ideations.service";

describe("IdeationsController", () => {
    let controller: IdeationsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [IdeationsController],
            providers: [{ provide: IdeationsService, useValue: {} }],
        }).compile();

        controller = module.get<IdeationsController>(IdeationsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
