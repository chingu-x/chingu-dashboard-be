import { Test, TestingModule } from "@nestjs/testing";
import { GlobalService } from "./global.service";
import { PrismaService } from "../prisma/prisma.service";

describe("GlobalService", () => {
    let service: GlobalService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: PrismaService,
                    useValue: {},
                },
                GlobalService,
            ],
        }).compile();

        service = module.get<GlobalService>(GlobalService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
