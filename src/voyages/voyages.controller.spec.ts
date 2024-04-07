import { Test, TestingModule } from "@nestjs/testing";
import { VoyagesController } from "./voyages.controller";
import { VoyagesService } from "./voyages.service";

describe("VoyagesController", () => {
    let controller: VoyagesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VoyagesController],
            providers: [VoyagesService],
        }).compile();

        controller = module.get<VoyagesController>(VoyagesController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
