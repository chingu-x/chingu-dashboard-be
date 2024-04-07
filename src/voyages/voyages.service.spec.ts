import { Test, TestingModule } from "@nestjs/testing";
import { VoyagesService } from "./voyages.service";

describe("VoyagesService", () => {
    let service: VoyagesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VoyagesService],
        }).compile();

        service = module.get<VoyagesService>(VoyagesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
