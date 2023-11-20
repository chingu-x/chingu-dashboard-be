import { Test, TestingModule } from "@nestjs/testing";
import { IdeationsService } from "./ideations.service";
import { PrismaService } from "../prisma/prisma.service";
import { GlobalService } from "../global/global.service";

describe("IdeationsService", () => {
    let service: IdeationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IdeationsService,
                {
                    provide: PrismaService,
                    useValue: {},
                },
                GlobalService,
            ],
        }).compile();

        service = module.get<IdeationsService>(IdeationsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
