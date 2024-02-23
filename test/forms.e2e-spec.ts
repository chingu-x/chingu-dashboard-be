import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { seed } from "../prisma/seed/seed";
import * as request from "supertest";
import * as cookieParser from "cookie-parser";
import { extractCookieByKey } from "./utils";
//
const loginUrl = "/auth/login";

const loginAndGetTokens = async (
    email: string,
    password: string,
    app: INestApplication,
) => {
    const r = await request(app.getHttpServer()).post(loginUrl).send({
        email,
        password,
    });

    const access_token = extractCookieByKey(
        r.headers["set-cookie"],
        "access_token",
    );
    const refresh_token = extractCookieByKey(
        r.headers["set-cookie"],
        "refresh_token",
    );

    return { access_token, refresh_token };
};

describe("FormController e2e Tests", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        await seed();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        app.use(cookieParser());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe("Get Forms", () => {
        it("Get all forms", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get("/forms")
                .set("Cookie", [access_token, refresh_token])
                .expect(200);
        });
        it("Get a specific form", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const formId = 1;
            await request(app.getHttpServer())
                .get(`/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(200);
        });
    });
});
