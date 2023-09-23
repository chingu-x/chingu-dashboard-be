import { Test, TestingModule } from "@nestjs/testing";
import { IdeationService } from "./ideation.service";
import {PrismaService} from "../prisma/prisma.service";

describe("IdeationService", () => {
    let service: IdeationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [IdeationService, PrismaService],
        }).compile();

        service = module.get<IdeationService>(IdeationService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
