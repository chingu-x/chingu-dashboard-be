import { Test, TestingModule } from "@nestjs/testing";
import { DevelopmentService } from "./development.service";
import * as Seed from "../../prisma/seed/seed";
import * as process from "node:process";
import { AppConfigService } from "../config/app/appConfig.service";

describe("DevelopmentService", () => {
    let service: DevelopmentService;
    let config: AppConfigService;
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
            providers: [
                DevelopmentService,
                {
                    provide: AppConfigService,
                    useValue: {
                        nodeEnv: jest.fn((key: string) =>
                            key === "NODE_ENV" ? "development" : undefined,
                        ),
                    },
                },
            ],
        }).compile();
        config = module.get<AppConfigService>(AppConfigService);
        service = module.get<DevelopmentService>(DevelopmentService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to reseed the database", async () => {
        Object.defineProperty(config, "nodeEnv", {
            get: jest.fn().mockReturnValue("development"),
        });
        const seedFnMock = jest
            .spyOn(Seed, "seed")
            .mockImplementationOnce((): Promise<any> => Promise.resolve(null));
        await service.reseedDatabase(responseMock);
        expect(seedFnMock).toHaveBeenCalled();
    });
});
