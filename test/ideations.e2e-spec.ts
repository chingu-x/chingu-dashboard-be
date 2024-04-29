import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { extractResCookieValueByKey, loginAndGetTokens } from "./utils";
import { CASLForbiddenExceptionFilter } from "../src/exception-filters/casl-forbidden-exception.filter";
import { seed } from "../prisma/seed/seed";
import * as cookieParser from "cookie-parser";

describe("IdeationsController (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let accessToken: any;
    let newUserAccessToken: string;
    let adminAccessToken: string;

    async function loginAdmin() {
        await request(app.getHttpServer()).post("/auth/logout");
        await request(app.getHttpServer())
            .post("/auth/login")
            .send({
                email: "jessica.williamson@gmail.com",
                password: "password",
            })
            .expect(200)
            .then((res) => {
                adminAccessToken = extractResCookieValueByKey(
                    res.headers["set-cookie"],
                    "access_token",
                );
            });
    }

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

    beforeEach(async () => {
        await loginAndGetTokens(userEmail, "password", app).then((tokens) => {
            accessToken = tokens.access_token;
        });
    });

    const userVoyageTeamId = 1;
    const userEmail = "dan@random.com";

    describe("/POST voyages/teams/:teamId/ideations", () => {
        const createIdeationUrl = `/voyages/teams/${userVoyageTeamId}/ideations`;

        it("should return 201 if ideation is created", async () => {
            const ideationCountBefore = await prisma.projectIdea.count();
            const data = {
                title: "Fitness Tracker App",
                description: "Use React app, node.js backend, and SQL",
                vision: "Lists workouts, video walkthroughs, calendar scheduling, and fitness diary.",
            };

            await request(app.getHttpServer())
                .post(createIdeationUrl)
                .set("Cookie", accessToken)
                .send(data)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        ...data,
                        voyageTeamMemberId: userVoyageTeamId,
                    });
                });

            const ideationCountAfter = await prisma.projectIdea.count();
            expect(ideationCountAfter).toEqual(ideationCountBefore + 1);
        });

        it("should return 401 if user is not logged in", async () => {
            const ideationCountBefore = await prisma.projectIdea.count();
            await request(app.getHttpServer())
                .post(createIdeationUrl)
                .send({
                    title: "Fitness Tracker App",
                    description: "Use React app, node.js backend, and SQL",
                    vision: "Lists workouts, video walkthroughs, calendar scheduling, and fitness diary.",
                })
                .expect(401);

            const ideationCountAfter = await prisma.projectIdea.count();
            expect(ideationCountAfter).toEqual(ideationCountBefore);
        });

        it("should return 403 if teamId does not exist or user does not belong to teamId", async () => {
            const ideationCountBefore = await prisma.projectIdea.count();
            await request(app.getHttpServer())
                .post(`/voyages/teams/100/ideations`)
                .set("Cookie", accessToken)
                .send({
                    title: "Fitness Tracker App",
                    description: "Use React app, node.js backend, and SQL",
                    vision: "Lists workouts, video walkthroughs, calendar scheduling, and fitness diary.",
                })
                .expect(403);

            const ideationCountAfter = await prisma.projectIdea.count();
            expect(ideationCountAfter).toEqual(ideationCountBefore);
        });
    });

    describe("/GET voyages/teams/:teamId/ideations", () => {
        const getIdeationUrl = `/voyages/teams/${userVoyageTeamId}/ideations`;
        it("should return 200 when user's own teams' ideations are returned", async () => {
            await request(app.getHttpServer())
                .get(getIdeationUrl)
                .set("Cookie", accessToken)
                .expect(200);
        });

        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer()).get(getIdeationUrl).expect(401);
        });

        it("should return 403 when user try to access other teams ideations", async () => {
            await request(app.getHttpServer())
                .get(`/voyages/teams/2/ideations`)
                .set("Cookie", accessToken)
                .expect(403);
        });
    });

    describe("/POST voyages/teams/:teamId/ideations/:ideationId/ideation-votes", () => {
        const ideationId = 1;
        const ideationVoteUrl = `/voyages/teams/${userVoyageTeamId}/ideations/${ideationId}/ideation-votes`;

        it("should return 201 if an ideation vote is successfully created", async () => {
            // login to another user in the same team to vote
            const { access_token } = await loginAndGetTokens(
                "leo.rowe@outlook.com",
                "password",
                app,
            );

            const voteCountBefore = await prisma.projectIdeaVote.count({
                where: {
                    projectIdeaId: 1,
                },
            });

            await request(app.getHttpServer())
                .post(ideationVoteUrl)
                .set("Cookie", access_token)
                .expect(201);

            const voteCountAfter = await prisma.projectIdeaVote.count({
                where: {
                    projectIdeaId: 1,
                },
            });

            expect(voteCountAfter).toEqual(voteCountBefore + 1);
        });

        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer())
                .post(ideationVoteUrl)
                .expect(401);
        });

        it("should return 403 when user is voting for another ideation which belongs to another team", async () => {
            await request(app.getHttpServer())
                .post(`/voyages/teams/2/ideations/4/ideation-votes`)
                .set("Cookie", accessToken)
                .expect(403);
        });

        it("should return 404 when the ideation ID doesn't exist", async () => {
            await request(app.getHttpServer())
                .post(`/voyages/teams/1/ideations/20/ideation-votes`)
                .set("Cookie", accessToken)
                .expect(404);
        });

        it("should return 409 if there's an existing vote", async () => {
            await request(app.getHttpServer())
                .post(ideationVoteUrl)
                .set("Cookie", accessToken)
                .expect(409);
        });
    });

    describe("/DELETE voyages/teams/:teamId/ideations/:ideationId/ideation-votes", () => {
        const ideationId = 1;
        const ideationVoteUrl = `/voyages/teams/${userVoyageTeamId}/ideations/${ideationId}/ideation-votes`;

        it("should return 200 when ideation vote is deleted", async () => {
            const ideationCountBefore = await prisma.projectIdea.count();
            const ideationVoteCountBefore =
                await prisma.projectIdeaVote.count();

            await request(app.getHttpServer())
                .delete(ideationVoteUrl)
                .set("Cookie", accessToken)
                .expect(200);

            const ideationCountAfter = await prisma.projectIdea.count();
            const ideationVoteCountAfter = await prisma.projectIdeaVote.count();

            expect(ideationCountAfter).toEqual(ideationCountBefore);
            expect(ideationVoteCountAfter).toEqual(ideationVoteCountBefore - 1);
        });

        it("should return 400 when removing ideation votes they didn't vote for", async () => {
            const ideationCountBefore = await prisma.projectIdea.count();
            const ideationVoteCountBefore =
                await prisma.projectIdeaVote.count();
            await request(app.getHttpServer())
                .delete(
                    `/voyages/teams/${userVoyageTeamId}/ideations/8/ideation-votes`,
                )
                .set("Cookie", accessToken)
                .expect(400);

            const ideationCountAfter = await prisma.projectIdea.count();
            const ideationVoteCountAfter = await prisma.projectIdeaVote.count();

            expect(ideationCountAfter).toEqual(ideationCountBefore);
            expect(ideationVoteCountAfter).toEqual(ideationVoteCountBefore);
        });

        // Note: this should be 404
        it("should return 400 when ideation id does not exist", async () => {
            await request(app.getHttpServer())
                .delete(
                    `/voyages/teams/${userVoyageTeamId}/ideations/100/ideation-votes`,
                )
                .set("Cookie", accessToken)
                .expect(400);
        });

        // Note: this should be 403
        it("should return 400 when user is trying to delete a vote for an ideation not in their team", async () => {
            // JosoMadar@dayrep.com is in team 2
            const { access_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .delete(ideationVoteUrl)
                .set("Cookie", access_token)
                .expect(400);
        });

        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer())
                .delete(ideationVoteUrl)
                .expect(401);
        });
    });

    describe("/PATCH /teams/:teamId/ideations/:ideationId", () => {
        const ideationId = 1;
        const updateIdeationUrl = `/voyages/teams/${userVoyageTeamId}/ideations/${ideationId}`;
        it("should return 200 if update is successful", async () => {
            const ideationToUpdate = await prisma.projectIdea.findUnique({
                where: { id: ideationId },
            });
            const data = { title: "updated title" };
            await request(app.getHttpServer())
                .patch(updateIdeationUrl)
                .set("Cookie", accessToken)
                .send(data)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        ...data,
                        id: ideationToUpdate.id,
                        voyageTeamMemberId: ideationToUpdate.voyageTeamMemberId,
                        description: ideationToUpdate.description,
                        vision: ideationToUpdate.vision,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    });
                })
                .expect(200);
        });

        it("should return 400 when teamId or Ideation Id is wrong", async () => {
            await request(app.getHttpServer())
                .delete(`/voyages/teams/${userVoyageTeamId}/ideations/200`)
                .set("Cookie", accessToken)
                .expect(400);

            await request(app.getHttpServer())
                .delete(`/voyages/teams/2/ideations/1`)
                .set("Cookie", accessToken)
                .expect(400);
        });

        // Note: should be 403
        it("should return 400 when user tries to delete someone else's ideation in the same team", async () => {
            await request(app.getHttpServer())
                .delete(`/voyages/teams/${userVoyageTeamId}/ideations/8`)
                .set("Cookie", accessToken)
                .expect(400);
        });

        it("should return 401 when user is not logged in", async () => {
            await request(app.getHttpServer())
                .delete(updateIdeationUrl)
                .expect(401);
        });
    });

    describe("/DELETE /teams/:teamId/ideations/:ideationId", () => {
        const ideationId = 1;
        const deleteIdeationUrl = `/voyages/teams/${userVoyageTeamId}/ideations/${ideationId}`;

        // user can only delete their own ideation when there is no votes except their own,
        // this will also delete their own vote if exist
        it("should return 200 if the user delete their own ideation without other votes", async () => {
            const ideationCountBefore = await prisma.projectIdea.count();
            const ideationVoteCountBefore =
                await prisma.projectIdeaVote.count();

            await request(app.getHttpServer())
                .delete(`/voyages/teams/${userVoyageTeamId}/ideations/3`)
                .set("Cookie", accessToken)
                .expect(200);

            const ideationCountAfter = await prisma.projectIdea.count();
            const ideationVoteCountAfter = await prisma.projectIdeaVote.count();

            expect(ideationCountAfter).toEqual(ideationCountBefore - 1);
            expect(ideationVoteCountAfter).toEqual(ideationVoteCountBefore - 1);
        });

        // user cannot delete someone else's ideation
        // Note: should be 403
        it("should return 400 if the user delete their own ideation with other votes", async () => {
            const ideationCountBefore = await prisma.projectIdea.count();
            const ideationVoteCountBefore =
                await prisma.projectIdeaVote.count();

            await request(app.getHttpServer())
                .delete(`/voyages/teams/${userVoyageTeamId}/ideations/7`)
                .set("Cookie", accessToken)
                .expect(400);

            const ideationCountAfter = await prisma.projectIdea.count();
            const ideationVoteCountAfter = await prisma.projectIdeaVote.count();

            expect(ideationCountAfter).toEqual(ideationCountBefore);
            expect(ideationVoteCountAfter).toEqual(ideationVoteCountBefore);
        });

        it("should return 401 if the user is not logged in", async () => {
            await request(app.getHttpServer())
                .delete(deleteIdeationUrl)
                .expect(401);
        });

        // Should be 404
        it("should return 400 if ideation Id does not exist", async () => {
            await request(app.getHttpServer())
                .delete(`/voyages/teams/${userVoyageTeamId}/ideations/200`)
                .set("Cookie", accessToken)
                .expect(400);
        });

        // user cannot delete ideation with votes in it
        it("should return 409 if the user delete their own ideation with other votes", async () => {
            // add a vote by another team member
            const { access_token } = await loginAndGetTokens(
                "leo.rowe@outlook.com",
                "password",
                app,
            );

            await request(app.getHttpServer())
                .post(`/voyages/teams/1/ideations/2/ideation-votes`)
                .set("Cookie", access_token)
                .expect(201);

            const ideationCountBefore = await prisma.projectIdea.count();
            const ideationVoteCountBefore =
                await prisma.projectIdeaVote.count();

            await request(app.getHttpServer())
                .delete(`/voyages/teams/${userVoyageTeamId}/ideations/2`)
                .set("Cookie", accessToken)
                .expect(409);

            const ideationCountAfter = await prisma.projectIdea.count();
            const ideationVoteCountAfter = await prisma.projectIdeaVote.count();

            expect(ideationCountAfter).toEqual(ideationCountBefore);
            expect(ideationVoteCountAfter).toEqual(ideationVoteCountBefore);
        });
    });

    describe("POST /voyages/teams/:teamId/ideations/:ideationId/select - selects project ideation for voyage", () => {
        it("should return 201 if successfully selecting ideation", async () => {
            const teamId: number = 1;
            const ideationId: number = 1;

            return request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/ideations/${ideationId}/select`)
                .set("Authorization", `Bearer ${newUserAccessToken}`)
                .expect(201);
        });

        it("should return 409 if an ideation is already selected", async () => {
            const teamId: number = 1;
            const ideationId: number = 1;

            try {
                await prisma.projectIdea.update({
                    where: {
                        id: ideationId,
                    },
                    data: {
                        isSelected: true,
                    },
                });
            } catch (e) {
                throw e;
            }

            return request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/ideations/${ideationId}/select`)
                .set("Authorization", `Bearer ${newUserAccessToken}`)
                .expect(409);
        });

        it("should return 404 if ideation is not found", async () => {
            const teamId: number = 1;
            const ideationId: number = 99;

            return request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/ideations/${ideationId}/select`)
                .set("Authorization", `Bearer ${newUserAccessToken}`)
                .expect(404);
        });

        it("should return 401 unauthorized if not logged in", async () => {
            const teamId: number = 1;
            const ideationId: number = 1;

            return request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/ideations/${ideationId}/select`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401);
        });
    });

    describe("POST /voyages/teams/:teamId/ideations/reset-selection - clears current team ideation selection", () => {
        it("should return 201 if selection successfully cleared", async () => {
            const teamId: number = 1;
            const ideationId: number = 1;
            await loginAdmin();

            try {
                await prisma.projectIdea.update({
                    where: {
                        id: ideationId,
                    },
                    data: {
                        isSelected: true,
                    },
                });
            } catch (e) {
                throw e;
            }
            return request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/ideations/reset-selection`)
                .set("Authorization", `Bearer ${adminAccessToken}`)
                .expect(201);
        });

        it("should return 403 if not logged in as admin", async () => {
            const teamId: number = 99;
            return request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/ideations/reset-selection`)
                .set("Authorization", `Bearer ${newUserAccessToken}`)
                .expect(403);
        });

        it("should return 404 if team id is not found", async () => {
            const teamId: number = 99;
            await loginAdmin();

            return request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/ideations/reset-selection`)
                .set("Authorization", `Bearer ${adminAccessToken}`)
                .expect(404);
        });

        it("should return 401 unauthorized if not logged in", async () => {
            const teamId: number = 1;

            return request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}/ideations/reset-selection`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401);
        });
    });
});
