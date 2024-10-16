import { Test, TestingModule } from "@nestjs/testing";
import { SprintsService } from "./sprints.service";
import { PrismaService } from "@/prisma/prisma.service";
import { GlobalService } from "@/global/global.service";
import { FormsService } from "@/forms/forms.service";

describe("SprintsService", () => {
    let service: SprintsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SprintsService,
                {
                    provide: PrismaService,
                    useValue: {},
                },
                GlobalService,
                FormsService,
            ],
        }).compile();

        service = module.get<SprintsService>(SprintsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
