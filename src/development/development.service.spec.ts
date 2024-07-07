import { Test, TestingModule } from "@nestjs/testing";
import { DevelopmentService } from "./development.service";
import * as Seed from "../../prisma/seed/seed";
import * as process from "node:process";

describe("DevelopmentService", () => {
    let service: DevelopmentService;
    const oldNodeEnv = process.env.NODE_ENV;

    beforeAll(() => {
        process.env.NODE_ENV = "development";
    });

    afterAll(() => {
        process.env.NODE_ENV = oldNodeEnv;
    });

    const responseMock = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        clearCookie: jest.fn().mockReturnThis(),
    } as unknown as Response;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DevelopmentService],
        }).compile();

        service = module.get<DevelopmentService>(DevelopmentService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to reseed the database", async () => {
        const seedFnMock = jest
            .spyOn(Seed, "seed")
            .mockImplementationOnce((): Promise<any> => Promise.resolve(null));
        await service.reseedDatabase(responseMock);
        expect(seedFnMock).toHaveBeenCalled();
    });
});
