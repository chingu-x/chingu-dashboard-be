import { Test, TestingModule } from "@nestjs/testing";
import { TechsService } from "./techs.service";
import { PrismaService } from "@/prisma/prisma.service";
import { GlobalService } from "@/global/global.service";

describe("TechsService", () => {
    let service: TechsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TechsService,
                {
                    provide: PrismaService,
                    useValue: {},
                },
                GlobalService,
            ],
        }).compile();

        service = module.get<TechsService>(TechsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
