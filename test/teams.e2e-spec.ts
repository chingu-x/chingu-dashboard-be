import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { seed } from "@Prisma/seed/seed";
import { loginAndGetTokens } from "./utils";
import * as cookieParser from "cookie-parser";
import { CASLForbiddenExceptionFilter } from "@/exception-filters/casl-forbidden-exception.filter";
import { toBeArray } from "jest-extended";

expect.extend({ toBeArray });

//Logged in user is Jessica Williamson for admin routes /teams and /teams/voyages/:voyageid
//Logged in user is Dan ko for team member routes /teams/:teamid and /teams/:teamid/members
//Dan Ko is part of the team with team id 4

describe("Teams Controller (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let accessToken: string;

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

    describe("GET /teams - gets all voyage teams", () => {
        it("should return 200 and array of voyage teams", async () => {
            const { access_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get("/teams")
                .set("Cookie", access_token)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toBeArray();
                });
        });
        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer())
                .get("/teams")
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401)
                .expect("Content-Type", /json/);
        });
        it("should return 403 when non-admin user tries to access it", async () => {
            const { access_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get("/teams")
                .set("Cookie", access_token)
                .expect(403)
                .expect("Content-Type", /json/);
        });
    });
    describe("GET /teams/voyages/:voyageid - Gets all team for a voyage given a voyage id", () => {
        it("should return 200 and array of voyage teams", async () => {
            const voyageId: number = 3;
            const { access_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get(`/teams/voyages/${voyageId}`)
                .set("Cookie", access_token)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toBeArray();
                });
        });
        it("should return 404 if voyage teams are not found given a voyage id", async () => {
            const voyageId: number = 999999;
            const { access_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get(`/teams/voyages/${voyageId}`)
                .set("Cookie", access_token)
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
        it("should return 403 when non-admin user tries to access it", async () => {
            const voyageId: number = 3;
            const { access_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get(`/teams/voyages/${voyageId}`)
                .set("Cookie", access_token)
                .expect(403)
                .expect("Content-Type", /json/);
        });
    });
    describe("GET /teams/:teamid - Gets one team details given a team id", () => {
        beforeEach(async () => {
            const tokens = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            accessToken = tokens.access_token;
        });
        it("should return 200 and array of voyage teams", async () => {
            const teamId: number = 4;
            await request(app.getHttpServer())
                .get(`/teams/${teamId}`)
                .set("Cookie", accessToken)
                .expect(200)
                .expect("Content-Type", /json/);
        });
        it("should return 404 if voyage team is not found given a team id", async () => {
            const teamId: number = 999999;
            await request(app.getHttpServer())
                .get(`/teams/${teamId}`)
                .set("Cookie", accessToken)
                .expect(404);
        });
        it("should return 401 when user is not logged in", async () => {
            const teamId: number = 4;
            await request(app.getHttpServer())
                .get(`/teams/${teamId}`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401)
                .expect("Content-Type", /json/);
        });
        it("should return 403 when user tries to GET details of other team", async () => {
            const teamId: number = 3;
            await request(app.getHttpServer())
                .get(`/teams/${teamId}`)
                .set("Cookie", accessToken)
                .expect(403);
        });
    });
    describe("PATCH /teams/:teamid/members - Updates team members hours per sprint", () => {
        beforeEach(async () => {
            const tokens = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            accessToken = tokens.access_token;
        });
        it("should return 200 and updated users sprints per hour", async () => {
            const teamId: number = 4;
            const hrPerSprint: number = 2;

            await request(app.getHttpServer())
                .patch(`/teams/${teamId}/members`)
                .set("Cookie", accessToken)
                .send({ hrPerSprint })
                .expect(200);
        });
        it("should return 404 if voyage team is not found given a team id", async () => {
            const teamId: number = 999999;
            const hrPerSprint: number = 2;

            await request(app.getHttpServer())
                .patch(`/teams/${teamId}/members`)
                .set("Cookie", accessToken)
                .send({ hrPerSprint })
                .expect(404);
        });
        it("should return 401 when user is not logged in", async () => {
            const teamId: number = 4;
            const hrPerSprint: number = 2;
            await request(app.getHttpServer())
                .patch(`/teams/${teamId}/members`)
                .set("Authorization", `Bearer ${undefined}`)
                .send({ hrPerSprint })
                .expect(401)
                .expect("Content-Type", /json/);
        });
        it("should return 403 when user tries to PATCH details of other team", async () => {
            const teamId: number = 3;
            const hrPerSprint: number = 2;
            await request(app.getHttpServer())
                .patch(`/teams/${teamId}/members`)
                .set("Cookie", accessToken)
                .send({ hrPerSprint })
                .expect(403);
        });
    });
});
