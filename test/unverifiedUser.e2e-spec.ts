import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { seed } from "../prisma/seed/seed";
import { getUseridFromEmail, loginAndGetTokens } from "./utils";
import * as cookieParser from "cookie-parser";
import { CASLForbiddenExceptionFilter } from "src/exception-filters/casl-forbidden-exception.filter";

//Logged in user is Yoshi Amano

describe("Unverified user routes (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let userId: string | undefined;

    const userEmail: string = "yoshi@gmail.com";

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

    describe("GET /users/me - get logged in users own details", () => {
        it("should return 200 and ..., when logged in as unverified user.", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                userEmail,
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
    });

    describe("POST /auth/logout - logout current user", () => {
        it("should return 200 when logged out unverified user.", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                userEmail,
                "password",
                app,
            );
            await request(app.getHttpServer())
                .post("/auth/logout")
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toBeObject;
                });
        });
    });

    describe("POST /auth/resend-email - resend verification email", () => {
        it("should return 200 when email is successfully sent", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                userEmail,
                "password",
                app,
            );
            await request(app.getHttpServer())
                .post("/auth/resend-email")
                .set("Cookie", [access_token, refresh_token])
                .send({ email: userEmail })
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toBeObject;
                });
        });
    });
});
