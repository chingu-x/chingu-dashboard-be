import { Test, TestingModule } from "@nestjs/testing";
import { TechsService } from "./techs.service";

describe("TechsService", () => {
    let service: TechsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TechsService],
        }).compile();

        service = module.get<TechsService>(TechsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
