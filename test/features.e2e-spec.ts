import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { seed } from "../prisma/seed/seed";
import { loginAndGetTokens } from "./utils";
import * as cookieParser from "cookie-parser";
import { CASLForbiddenExceptionFilter } from "@/exception-filters/casl-forbidden-exception.filter";

// Logged in user is dan@random.com
// Dan is a member of teamId 1 and teamMemberId 1
// Dan is the creator of features having featureId 1 , 2 and 3

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
                "dan@random.com",
                "password",
                app,
            );
            const teamId: number = 1;
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
            const teamId: number = 1;
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
            const teamId: number = 99999;
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
        it("should return 403 when a user tries to post feature in other team", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const teamId: number = 2;
            const featureData = {
                featureCategoryId: 1,
                description: "This is a valid feature",
            };

            await request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/features`)
                .send(featureData)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 403 when a non voyager tries to post a feature", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );

            const teamId: number = 1;
            const featureData = {
                featureCategoryId: 1,
                description: "This is a valid feature",
            };

            await request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/features`)
                .send(featureData)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 404 when feature category does not exist", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const teamId: number = 1;
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
                "dan@random.com",
                "password",
                app,
            );
            const teamId: number = 1;

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
            const teamId: number = 1;

            await request(app.getHttpServer())
                .get(`/voyages/teams/${teamId}/features`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401);
        });
        it("should return 400 for invalid team id", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const teamId: number = 999999;

            await request(app.getHttpServer())
                .get(`/voyages/teams/${teamId}/features`)
                .set("Cookie", [access_token, refresh_token])
                .expect(400);
        });
        it("should return 403 when a user tries to access all feature in other team", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const teamId: number = 2;

            await request(app.getHttpServer())
                .get(`/voyages/teams/${teamId}/features`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 403 when a non voyager tries to access features", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );

            const teamId: number = 1;

            await request(app.getHttpServer())
                .get(`/voyages/teams/${teamId}/features`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403)
                .expect("Content-Type", /json/);
        });
    });
    describe("GET /voyages/features/feature-categories - Gets all feature categories", () => {
        it("should return 200 and an array of feature categories", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
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
        it("should return 403 when a non voyager tries to access feature categories", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );

            await request(app.getHttpServer())
                .get(`/voyages/features/feature-categories`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403)
                .expect("Content-Type", /json/);
        });
    });
    describe("GET /voyages/features/:featureId - [Permission: own_team] - Gets a feature for a featureId (int)", () => {
        it("should return 200 and the feature object", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );

            const featureId: number = 1;

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
            const featureId: number = 1;

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

            const featureId: number = 999999;

            await request(app.getHttpServer())
                .get(`/voyages/features/${featureId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });
        it("should return 403 when a user tries to access a feature in other team", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const featureId: number = 4;

            await request(app.getHttpServer())
                .get(`/voyages/features/${featureId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 403 when a non voyager tries to access a feature in other team", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );
            const featureId: number = 4;

            await request(app.getHttpServer())
                .get(`/voyages/features/${featureId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });
    describe("PATCH /voyages/features/:featureId - [Permission: own_team] - Updates a feature for a featureId (int)", () => {
        it("should return 200 and the updated feature object", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );

            const featureId: number = 1;
            const updatedFeature = {
                description:
                    "This is a updated description of must have feature",
                teamMemberId: 1,
            };

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}`)
                .send(updatedFeature)
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body.description).toEqual(
                        updatedFeature.description,
                    );
                });
        });
        it("should return 401 when user is not logged in", async () => {
            const featureId: number = 1;
            const updatedFeature = {
                description:
                    "This is a updated description of must have feature",
                teamMemberId: 1,
            };

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}`)
                .set("Authorization", `Bearer ${undefined}`)
                .send(updatedFeature)
                .expect(401);
        });
        it("should return 404 when feature does not exist", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );

            const featureId: number = 999999;

            const updatedFeature = {
                description:
                    "This is a updated description of must have feature",
                teamMemberId: 1,
            };

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}`)
                .send(updatedFeature)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });

        it("should return 400 when feature description is empty", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );

            const featureId: number = 1;
            const updatedFeature = {
                description: "",
                teamMemberId: 1,
            };

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}`)
                .send(updatedFeature)
                .set("Cookie", [access_token, refresh_token])
                .expect(400);
        });
        it("should return 400 when teamMemberId is not provided", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );

            const featureId: number = 1;
            const updatedFeature = {
                description:
                    "This is a updated description of must have feature",
            };

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}`)
                .send(updatedFeature)
                .set("Cookie", [access_token, refresh_token])
                .expect(400);
        });
        it("should return 400 when teamMemberId in the dto is invalid", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );

            const featureId: number = 1;
            const updatedFeature = {
                description:
                    "This is a updated description of must have feature",
                teamMemberId: 999999,
            };

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}`)
                .send(updatedFeature)
                .set("Cookie", [access_token, refresh_token])
                .expect(400);
        });
        it("should return 403 when trying to patch a feature created by other member", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const featureId: number = 4;
            const updatedFeature = {
                description:
                    "This is a updated description of must have feature",
                teamMemberId: 1,
            };

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}`)
                .send(updatedFeature)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 403 when a non voyager tries to update a feature", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );

            const featureId: number = 1;
            const updatedFeature = {
                description:
                    "This is a updated description of must have feature",
                teamMemberId: 1,
            };

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}`)
                .send(updatedFeature)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });

    describe("DELETE /voyages/features/:featureId - [Permission: own_team] - Deletes a feature for a featureId (int)", () => {
        it("should return 200 when feature is deleted", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const featureId: number = 1;

            await request(app.getHttpServer())
                .delete(`/voyages/features/${featureId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(200);
        });
        it("should return 401 when user is not logged in", async () => {
            const featureId: number = 1;

            await request(app.getHttpServer())
                .delete(`/voyages/features/${featureId}`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401);
        });
        it("should return 404 when feature does not exist", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );

            const featureId: number = 999999;

            await request(app.getHttpServer())
                .delete(`/voyages/features/${featureId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });
        it("should return 403 when trying to delete a feature created by other member", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const featureId: number = 4;

            await request(app.getHttpServer())
                .delete(`/voyages/features/${featureId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 403 when a non voyager tries to update a feature", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );

            const featureId: number = 1;

            await request(app.getHttpServer())
                .delete(`/voyages/features/${featureId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });
    describe("PATCH /voyages/features/:featureId/reorder - [Permission: own_team] - updates the order or category of features given a featureId (int), featureCategoryId (int) and order (int)", () => {
        it("should return 200 and update the ordering of features", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const featureId: number = 2;
            const featureCategoryId: number = 2;
            const order: number = 3;

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}/reorder`)
                .send({ featureCategoryId, order })
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    const feature = res.body.find(
                        (feature) => feature.id === featureId,
                    );
                    expect(feature).toMatchObject({
                        id: featureId,
                        description: expect.any(String),
                        order: order,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        teamMemberId: expect.any(Number),
                        category: {
                            id: featureCategoryId,
                            name: expect.any(String),
                        },
                        addedBy: {
                            member: {
                                id: expect.any(String),
                                firstName: expect.any(String),
                                lastName: expect.any(String),
                                avatar: expect.any(String),
                            },
                        },
                    });
                });
        });
        it("should return 200 when a other user tries to update the order of features of same team", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "leo.rowe@outlook.com",
                "password",
                app,
            );
            const featureId: number = 2;
            const featureCategoryId: number = 2;
            const order: number = 3;

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}/reorder`)
                .send({ featureCategoryId, order })
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/);
        });
        it("should return 400 for a invalid featureCategoryId", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const featureId: number = 2;
            const featureCategoryId: number = 4;
            const order: number = 3;

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}/reorder`)
                .send({ featureCategoryId, order })
                .set("Cookie", [access_token, refresh_token])
                .expect(400)
                .expect("Content-Type", /json/);
        });
        it("should return 404 for a invalid featureId", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const featureId: number = 999999;
            const featureCategoryId: number = 2;
            const order: number = 3;

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}/reorder`)
                .send({ featureCategoryId, order })
                .set("Cookie", [access_token, refresh_token])
                .expect(404)
                .expect("Content-Type", /json/);
        });
        it("should return 401 when user is not logged in", async () => {
            const featureId: number = 2;
            const featureCategoryId: number = 2;
            const order: number = 3;

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}/reorder`)
                .send({ featureCategoryId, order })
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401);
        });
        it("should return 403 when a user tries to update the order of features of other team", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const featureId: number = 2;
            const featureCategoryId: number = 2;
            const order: number = 3;

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}/reorder`)
                .send({ featureCategoryId, order })
                .set("Cookie", [access_token, refresh_token])
                .expect(403)
                .expect("Content-Type", /json/);
        });
        it("should return 403 when a non voyager tries to update the order of features", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );

            const featureId: number = 2;
            const featureCategoryId: number = 2;
            const order: number = 3;

            await request(app.getHttpServer())
                .patch(`/voyages/features/${featureId}/reorder`)
                .send({ featureCategoryId, order })
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });
});
