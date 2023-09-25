import { Test, TestingModule } from "@nestjs/testing";
import { HealthCheckService } from "src/HealthCheck/health-check.service";
import { PrismaService } from "src/prisma/prisma.service";

describe("HealthCheckService", () => {
    let healthCheckService: HealthCheckService;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HealthCheckService, PrismaService],
        }).compile();

        healthCheckService = module.get<HealthCheckService>(HealthCheckService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(healthCheckService).toBeDefined();
    });

    it("should create a health check entry in the test database", async () => {
        const checkData = {
            statusCode: 200,
            resMsg: "Hello World",
        };

        // Create entry in DB
        const result = await healthCheckService.createHealthCheck(checkData);

        // Check result of creation matches data given
        expect(result.statusCode).toEqual(checkData.statusCode);
        expect(result.resMsg).toEqual(checkData.resMsg);

        // Check Entry from the DB
        const createdEntry = await prismaService.healthCheck.findFirst({
            where: {
                statusCode: 200,
                resMsg: "Hello World",
            },
        });

        // Entry exists?
        expect(createdEntry).toBeDefined();

        // Entry is the same as what was created above?
        expect(result).toEqual(createdEntry);
    });
});
