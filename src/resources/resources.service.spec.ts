import { Test, TestingModule } from "@nestjs/testing";
import { ResourcesService } from "./resources.service";
import { PrismaService } from "../prisma/prisma.service";
import { GlobalService } from "../global/global.service";

describe("ResourcesService", () => {
    let service: ResourcesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ResourcesService,
                {
                    provide: PrismaService,
                    useValue: {},
                },
                GlobalService,
            ],
        }).compile();

        service = module.get<ResourcesService>(ResourcesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
