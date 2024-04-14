import { Test, TestingModule } from "@nestjs/testing";
import { VoyagesService } from "./voyages.service";
import { GlobalService } from "../global/global.service";
import { PrismaService } from "../prisma/prisma.service";

describe("VoyagesService", () => {
    let service: VoyagesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VoyagesService,
                {
                    provide: PrismaService,
                    useValue: {},
                },
                GlobalService,
            ],
        }).compile();

        service = module.get<VoyagesService>(VoyagesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
