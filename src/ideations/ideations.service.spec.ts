import { Test, TestingModule } from "@nestjs/testing";
import { IdeationsService } from "./ideations.service";
import { PrismaService } from "../prisma/prisma.service";

describe("IdeationsService", () => {
    let service: IdeationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [IdeationsService, PrismaService],
        }).compile();

        service = module.get<IdeationsService>(IdeationsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
