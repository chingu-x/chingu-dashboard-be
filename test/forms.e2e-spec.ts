import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { seed } from "../prisma/seed/seed";
import * as request from "supertest";
import * as cookieParser from "cookie-parser";
import { getNonAdminUser, loginAndGetTokens } from "./utils";
import { PrismaService } from "../src/prisma/prisma.service";
import { AbilitiesGuard } from "../src/auth/guards/abilities.guard";
import { AbilityFactory } from "../src/ability/ability.factory/ability.factory";
import { Reflector } from "@nestjs/core";

describe("FormController e2e Tests", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            providers: [AbilityFactory],
        }).compile();

        await seed();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);

        app.useGlobalPipes(new ValidationPipe());

        const caslAbilityFactory =
            moduleFixture.get<AbilityFactory>(AbilityFactory);
        app.useGlobalGuards(
            new AbilitiesGuard(new Reflector(), caslAbilityFactory),
        );
        app.use(cookieParser());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
        await prisma.$disconnect();
    });

    describe("GET ALL /forms", () => {
        it("should return 200 when successfully retrieve all forms", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const response = await request(app.getHttpServer())
                .get("/forms")
                .set("Cookie", [access_token, refresh_token])
                .expect(200);

            const forms = await prisma.form.findMany();
            expect(response.body.length).toEqual(forms.length);
        });

        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer()).get("/forms").expect(401);
        });

        fit("should return 403 when accessed by a user without the admin role", async () => {
            const nonAdminUser = await getNonAdminUser();
            console.log("nonadminuser", nonAdminUser);
            const { access_token } = await loginAndGetTokens(
                nonAdminUser.email,
                "password",
                app,
            );
            await request(app.getHttpServer())
                .get("/forms")
                .set("Cookie", [access_token])
                .expect(403);
        });
    });
    describe("GET /forms/:formId", () => {
        it("should return 200 when successfully retrieve a specific form by ID", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const formId = 1;
            const expectedForm = await prisma.form.findUnique({
                where: {
                    id: formId,
                },
            });
            const response = await request(app.getHttpServer())
                .get(`/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(200);

            expect(response.body.id).toEqual(expectedForm.id);
        });

        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer()).get("/forms/1").expect(401);
        });

        it("should return a 404 error for a non-existent form ID", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const invalidFormId = 9999;
            await request(app.getHttpServer())
                .get(`/forms/${invalidFormId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404)
                .expect({
                    message: `Invalid formId: Form (id:${invalidFormId}) does not exist.`,
                    error: "Not Found",
                    statusCode: 404,
                });
        });
    });
});
