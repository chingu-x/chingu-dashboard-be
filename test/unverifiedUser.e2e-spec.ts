import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { seed } from "@Prisma/seed/seed";
import { loginAndGetTokens } from "./utils";
import * as cookieParser from "cookie-parser";
import { CASLForbiddenExceptionFilter } from "@/exception-filters/casl-forbidden-exception.filter";

//Logged in user is Yoshi Amano
//Tests are for routes that are accessible to unverified users
// - route /auth/resend-email is not tested, since this case is already covered in existing e2e test
// - route /features/feature-categories is included to test access forbidden response

describe("Unverified user routes (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;

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
        it("should return 200 and array of user's data when logged in as unverified user", async () => {
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
        it("should return 200 when logged out unverified user", async () => {
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

    describe("GET /features/feature-categories - get features", () => {
        it("should return 403 when accessed by unverified user", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                userEmail,
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get("/voyages/features/feature-categories")
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });
});
