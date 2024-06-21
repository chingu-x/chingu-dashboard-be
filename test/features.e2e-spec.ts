import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { seed } from "../prisma/seed/seed";
import { loginAndGetTokens } from "./utils";
import * as cookieParser from "cookie-parser";
import { CASLForbiddenExceptionFilter } from "src/exception-filters/casl-forbidden-exception.filter";

describe("Features Controller (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        await seed();
        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        app.useGlobalPipes(new ValidationPipe());
        app.useGlobalFilters(new CASLForbiddenExceptionFilter());
        app.use(cookieParser());
        await app.init();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    describe("POST /voyages/teams/:teamId/features - [Permission: own_team] - Adds a new feature for a team given a teamId (int)", () => {
        it("should return 201 and the created feature", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const teamId = 1;
            const featureData = {
                featureCategoryId: 1,
                description: "This is a must have feature",
            };

            await request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/features`)
                .send(featureData)
                .set("Cookie", [access_token, refresh_token])
                .expect(201)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toMatchObject(featureData);
                });
        });
        it("should return 401 when user is not logged in", async () => {
            const teamId = 1;
            const featureData = {
                featureCategoryId: 1,
                description: "This is a must have feature",
            };

            await request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/features`)
                .set("Authorization", `Bearer ${undefined}`)
                .send(featureData)
                .expect(401);
        });
        it("should return 400 for invalid team id", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const teamId = 2;
            const featureData = {
                featureCategoryId: 1,
                description: "This is a must have feature",
            };

            await request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/features`)
                .send(featureData)
                .set("Cookie", [access_token, refresh_token])
                .expect(400);
        });
        it("should return 404 when feature category does not exist", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const teamId = 1;
            const featureData = {
                featureCategoryId: 4,
                description: "This is a not a valid feature",
            };

            await request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/features`)
                .send(featureData)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });
    });
    describe("GET /voyages/teams/:teamId/features - [Permission: own_team] - Gets all features for a team given a teamId (int)", () => {
        it("should return 200 and an array of features", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const teamId = 1;

            await request(app.getHttpServer())
                .get(`/voyages/teams/${teamId}/features`)
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body.length).toBeGreaterThan(0);
                });
        });
        it("should return 401 when user is not logged in", async () => {
            const teamId = 1;

            await request(app.getHttpServer())
                .get(`/voyages/teams/${teamId}/features`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401);
        });
        it("should return 404 for invalid team id", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const teamId = 999999;

            await request(app.getHttpServer())
                .get(`/voyages/teams/${teamId}/features`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });
    });
    describe("GET /voyages/features/feature-categories - Gets all feature categories", () => {
        it("should return 200 and an array of feature categories", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );

            await request(app.getHttpServer())
                .get(`/voyages/features/feature-categories`)
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body.length).toEqual(3);
                });
        });
        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer())
                .get(`/voyages/features/feature-categories`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401);
        });
    });
    describe("GET /voyages/features/:featureId - [Permission: own_team] - Gets a feature for a featureId (int)", () => {
        it("should return 200 and the feature object", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );

            const featureId = 1;

            await request(app.getHttpServer())
                .get(`/voyages/features/${featureId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body.id).toEqual(featureId);
                });
        });
        it("should return 401 when user is not logged in", async () => {
            const featureId = 1;

            await request(app.getHttpServer())
                .get(`/voyages/features/${featureId}`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401);
        });
        it("should return 404 when feature does not exist", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );

            const featureId = 999999;

            await request(app.getHttpServer())
                .get(`/voyages/features/${featureId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });
    });
});
