import { Test, TestingModule } from "@nestjs/testing";
import { HealthCheckService } from "@/HealthCheck/health-check.service";
import { PrismaService } from "@/prisma/prisma.service";
import { ConfigService, ConfigModule } from "@nestjs/config";

describe("HealthCheckService", () => {
    let healthCheckService: HealthCheckService;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot()],
            providers: [
                HealthCheckService,
                PrismaService,
                {
                    provide: "DB-Config",
                    useFactory(configService: ConfigService) {
                        return {
                            db: {
                                url: configService.get<string>("DATABASE_URL"),
                            },
                        };
                    },
                    inject: [ConfigService],
                },
            ],
        }).compile();

        healthCheckService = module.get<HealthCheckService>(HealthCheckService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await prismaService.healthCheck.deleteMany();
        await prismaService.$disconnect();
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
