import { Test, TestingModule } from "@nestjs/testing";
import { FormsService } from "./forms.service";
import { PrismaService } from "../prisma/prisma.service";
import { GlobalService } from "../global/global.service";

describe("FormsService", () => {
    let service: FormsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FormsService,
                {
                    provide: PrismaService,
                    useValue: {},
                },
                GlobalService,
            ],
        }).compile();

        service = module.get<FormsService>(FormsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
