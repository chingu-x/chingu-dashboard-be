import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { seed } from "../prisma/seed/seed";

describe("AuthController e2e Tests", () => {
    let app: INestApplication;
    //let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        //prisma = moduleFixture.get<PrismaService>(PrismaService);

        await seed();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should create a new user and email verification code", async () => {
        return true;
        //return request(app.getHttpServer()).post("/auth/signup").expect(201);
    });
});
