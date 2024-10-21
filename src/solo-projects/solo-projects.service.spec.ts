import { Test, TestingModule } from "@nestjs/testing";
import { SoloProjectsService } from "./solo-projects.service";

describe("SoloProjectsService", () => {
    let service: SoloProjectsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SoloProjectsService],
        }).compile();

        service = module.get<SoloProjectsService>(SoloProjectsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
