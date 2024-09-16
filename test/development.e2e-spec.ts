import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import * as cookieParser from "cookie-parser";
import { loginAndGetTokens } from "./utils";
import * as request from "supertest";
import * as process from "node:process";
import { AppConfigService } from "src/config/app/appConfig.service";

describe("Development Controller (e2e)", () => {
    let app: INestApplication;
    let config: AppConfigService;
    const OLD_ENV = process.env;

    beforeAll(async () => {
        jest.resetModules();
        // @ts-expect-error: "Cannot assign to env because it is a read-only property". But you really can.
        process.env = { ...OLD_ENV };
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            providers: [
                {
                    provide: AppConfigService,
                    useValue: {
                        nodeEnv: jest.fn((key: string) =>
                            key === "NODE_ENV" ? "development" : undefined,
                        ),
                    },
                },
            ],
        }).compile();
        config = moduleFixture.get<AppConfigService>(AppConfigService);
        app = moduleFixture.createNestApplication();
        app.use(cookieParser());
        await app.init();
    });

    afterAll(async () => {
        // @ts-expect-error: "Cannot assign to env because it is a read-only property". But you really can.
        process.env = OLD_ENV;
        await app.close();
    });

    describe("PUT /development/database/reseed", () => {
        it("should return 401 if user is not logged in", async () => {
            await request(app.getHttpServer())
                .put("/development/database/reseed")
                .expect(401);
        });
        it("should return 422 and not proceed if NODE_ENV is not development", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );

            await request(app.getHttpServer())
                .put("/development/database/reseed")
                .set("Cookie", [access_token, refresh_token])
                .expect(422);
        });

        it("should return 200 if NODE_ENV is development", async () => {
            jest.spyOn(config, "nodeEnv", "get").mockReturnValue("development");
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            process.env.NODE_ENV = "development";
            await request(app.getHttpServer())
                .put("/development/database/reseed")
                .set("Cookie", [access_token, refresh_token])
                .expect(200);
        });
    });
});
