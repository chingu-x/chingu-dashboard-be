import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { seed } from "../prisma/seed/seed";
import { loginAndGetTokens } from "./utils";
import * as cookieParser from "cookie-parser";

describe("Teams Controller (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let accessToken: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        await seed();
        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        app.useGlobalPipes(new ValidationPipe());
        app.use(cookieParser());
        await app.init();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    beforeEach(async () => {
        await loginAndGetTokens(
            "jessica.williamson@gmail.com",
            "password",
            app,
        ).then((tokens) => {
            accessToken = tokens.access_token;
        });
    });
    describe("GET /teams - gets all voyage teams", () => {
        it("should return 200 and array of voyage teams", async () => {
            await request(app.getHttpServer())
                .get("/teams")
                .set("Cookie", accessToken)
                .expect(200)
                .expect("Content-Type", /json/);
        });
        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer())
                .get("/teams")
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401)
                .expect("Content-Type", /json/);
        });
    });
    describe("GET /teams/voyages/:voyageid - Gets all team for a voyage given a voyage id", () => {
        it("should return 200 and array of voyage teams", async () => {
            const voyageId: number = 3;
            await request(app.getHttpServer())
                .get(`/teams/voyages/${voyageId}`)
                .set("Cookie", accessToken)
                .expect(200)
                .expect("Content-Type", /json/);
        });
        it("should return 404 if voyage teams are not found given a voyage id", async () => {
            const voyageId: number = 999999;
            await request(app.getHttpServer())
                .get(`/teams/voyages/${voyageId}`)
                .set("Cookie", accessToken)
                .expect(404);
        });
        it("should return 401 when user is not logged in", async () => {
            const voyageId: number = 3;
            await request(app.getHttpServer())
                .get(`/teams/voyages/${voyageId}`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401)
                .expect("Content-Type", /json/);
        });
    });
});
