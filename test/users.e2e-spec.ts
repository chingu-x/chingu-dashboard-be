import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { seed } from "../prisma/seed/seed";
import { getUseridFromEmail, loginAndGetTokens } from "./utils";
import * as cookieParser from "cookie-parser";
import { CASLForbiddenExceptionFilter } from "src/exception-filters/casl-forbidden-exception.filter";

//Logged in user is Jessica Williamson for admin routes
//Logged in user is Dan ko for non admin routes

describe("Users Controller (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let userId: string | undefined;

    const userEmail: string = "leo.rowe@outlook.com";

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

    describe("GET /users - [ role - Admin ] - gets all users", () => {
        it("should return 200 and array of users", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get("/users")
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toBeArray;
                });
        });
        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer())
                .get("/users")
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401)
                .expect("Content-Type", /json/);
        });
        it("should return 403 when non-admin user tries to access it", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get("/users")
                .set("Cookie", [access_token, refresh_token])
                .expect(403)
                .expect("Content-Type", /json/);
        });
    });
    describe("GET /users/me - get logged in users own details", () => {
        it("should return 200 and array of users", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get("/users/me")
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toBeObject;
                });
        });
        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer())
                .get("/users/me")
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401)
                .expect("Content-Type", /json/);
        });
    });
    describe("GET /users/:userId - [ role - Admin ] - gets a user with full deatils given a user id", () => {
        it("should return 200 and a object containing user details", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            userId = await getUseridFromEmail("leo.rowe@outlook.com");
            await request(app.getHttpServer())
                .get(`/users/${userId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body.email).toEqual("leo.rowe@outlook.com");
                });
        });
        it("should return 400 for a invalid UUID", async () => {
            const invalidUUID = "dd7851f9-12aa-e098a9df380c";
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get(`/users/${invalidUUID}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(400)
                .expect("Content-Type", /json/);
        });
        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer())
                .get(`/users/${userId}`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401)
                .expect("Content-Type", /json/);
        });
        it("should return 403 when non-admin user tries to access it", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get(`/users/${userId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403)
                .expect("Content-Type", /json/);
        });
        it("should return 404 if a user is not found for a given user id", async () => {
            const invalidUUID = "dd7851f9-12aa-47c9-a06f-e098a9df380c";
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get(`/users/${invalidUUID}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404)
                .expect("Content-Type", /json/);
        });
    });
    describe("GET /users/lookup-by-email - [ role - Admin ] - gets a user with full deatils given a user email", () => {
        it("should return 200 and a object containing the user details", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .post("/users/lookup-by-email")
                .set("Cookie", [access_token, refresh_token])
                .send({ email: userEmail })
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body.email).toEqual("leo.rowe@outlook.com");
                });
        });
        it("should return 404 if the is not found for the given email id", async () => {
            const notFoundEmail: string = "notfound@gmail.com";
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .post("/users/lookup-by-email")
                .set("Cookie", [access_token, refresh_token])
                .send({ email: notFoundEmail })
                .expect(404)
                .expect("Content-Type", /json/);
        });
        it("should return 400 if invalid email syntax is provided", async () => {
            const invalidEmail = "invalid.com";
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .post("/users/lookup-by-email")
                .set("Cookie", [access_token, refresh_token])
                .send({ email: invalidEmail })
                .expect(400)
                .expect("Content-Type", /json/);
        });
        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer())
                .post("/users/lookup-by-email")
                .set("Authorization", `Bearer ${undefined}`)
                .send({ email: userEmail })
                .expect(401)
                .expect("Content-Type", /json/);
        });
        it("should return 403 when non-admin user tries to access it", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .post("/users/lookup-by-email")
                .set("Cookie", [access_token, refresh_token])
                .send({ email: userEmail })
                .expect(403)
                .expect("Content-Type", /json/);
        });
    });
});
