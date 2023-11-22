import { Test, TestingModule } from "@nestjs/testing";
import { TeamsService } from "./teams.service";
import { PrismaService } from "../prisma/prisma.service";
import { GlobalService } from "../global/global.service";

describe("TeamsService", () => {
    let service: TeamsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TeamsService,
                {
                    provide: PrismaService,
                    useValue: {},
                },
                GlobalService,
            ],
        }).compile();

        service = module.get<TeamsService>(TeamsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
