import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { seed } from "../prisma/seed/seed";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { CreateResourceDto } from "src/resources/dto/create-resource.dto";
import { UpdateResourceDto } from "src/resources/dto/update-resource.dto";
import { extractResCookieValueByKey, loginAndGetTokens } from "./utils";
import { CASLForbiddenExceptionFilter } from "../src/exception-filters/casl-forbidden-exception.filter";
import * as cookieParser from "cookie-parser";

const loginUser = async (
    email: string,
    password: string,
    app: INestApplication,
) => {
    const res = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
            email,
            password,
        })
        .expect(200);

    return extractResCookieValueByKey(
        res.headers["set-cookie"],
        "access_token",
    );
};

const findVoyageTeamId = async (email: string, prisma: PrismaService) => {
    return prisma.voyageTeamMember.findFirst({
        where: {
            member: {
                email,
            },
        },
        select: {
            userId: true,
            voyageTeamId: true,
        },
    });
};

const findOwnResource = async (email: string, prisma: PrismaService) => {
    return prisma.teamResource.findFirst({
        where: {
            addedBy: {
                member: {
                    email,
                },
            },
        },
    });
};

const countResources = async (voyageTeamId: number, prisma: PrismaService) => {
    return prisma.teamResource.count({
        where: {
            addedBy: {
                voyageTeamId,
            },
        },
    });
};

describe("ResourcesController (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    // main user
    const userEmail: string = "dan@random.com";
    let voyageTeamId: number;
    let userAccessToken: string;
    // user for testing access control
    const otherUserEmail: string = "JosoMadar@dayrep.com";
    let otherVoyageTeamId: number;
    let otherUserAccessToken: string;

    const memberShape = {
        avatar: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        id: expect.any(String),
    };

    const resourceShape = {
        id: expect.any(Number),
        teamMemberId: expect.any(Number),
        url: expect.any(String),
        title: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
    };

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

        // voyageTeamId of main user
        const voyageTeam = await findVoyageTeamId(userEmail, prisma);
        voyageTeamId = voyageTeam!.voyageTeamId;
        userAccessToken = await loginUser(userEmail, "password", app);

        const otherVoyageTeam = await findVoyageTeamId(otherUserEmail, prisma);
        otherVoyageTeamId = otherVoyageTeam!.voyageTeamId;
        otherUserAccessToken = await loginUser(otherUserEmail, "password", app);

        if (voyageTeamId === otherVoyageTeamId) {
            throw new Error("Voyage team IDs should be different");
        }
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    describe("/POST voyages/:teamId/resources", () => {
        it("should return 201 and create a new resource", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const newResource: CreateResourceDto = {
                url: "http://www.github.com/chingux",
                title: "Chingu Github repo",
            };
            const initialResourceCount: number = await countResources(
                voyageTeamId,
                prisma,
            );

            await request(app.getHttpServer())
                .post(`/voyages/teams/${voyageTeamId}`)
                .set("Cookie", [access_token, refresh_token])
                .send(newResource)
                .expect(201)
                .expect("Content-Type", /json/)
                .expect(async (res) => {
                    expect(res.status).toBe(201);
                    expect(res.body).toEqual({ ...resourceShape });
                    const createdResource =
                        await prisma.teamResource.findUnique({
                            where: { id: res.body.id },
                        });
                    expect(createdResource).not.toBeNull();
                });
            const updatedResourceCount = await countResources(
                voyageTeamId,
                prisma,
            );
            expect(updatedResourceCount).toBe(initialResourceCount + 1);
        });

        it("should return 400 for invalid request body", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const invalidResource = {
                title: "Chingu Github repo",
            };

            await request(app.getHttpServer())
                .post(`/voyages/teams/${voyageTeamId}`)
                .set("Cookie", [access_token, refresh_token])
                .send(invalidResource)
                .expect(400);
        });

        it("should return 404 for invalid teamId", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const invalidTeamId = 999;
            const newResource: CreateResourceDto = {
                url: "http://www.github.com/chingux2",
                title: "Chingu Github repo",
            };

            await request(app.getHttpServer())
                .post(`/voyages/teams/${invalidTeamId}`)
                .set("Cookie", [access_token, refresh_token])
                .send(newResource)
                .expect(404);
        });

        it("should return 401 when the is not looged in", async () => {
            const newResource: CreateResourceDto = {
                url: "http://www.github.com/chingux3",
                title: "Chingu Github repo",
            };

            await request(app.getHttpServer())
                .post(`/voyages/teams/${voyageTeamId}`)
                .set("Authorization", `Bearer ${undefined}`)
                .send(newResource)
                .expect(401);
        });

        it("should return 403 when user of other team tries to post a resource", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );

            const newResource: CreateResourceDto = {
                url: "http://www.github.com/chingux4",
                title: "Chingu Github repo",
            };

            const teamId: number = 4;

            await request(app.getHttpServer())
                .post(`/voyages/teams/${teamId}`)
                .set("Cookie", [access_token, refresh_token])
                .send(newResource)
                .expect(403);
        });
    });

    describe("/GET voyages/:teamId/resources", () => {
        it("should return 200 and retrieve all resources for the team.", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const voyageTeamId: number = 1;
            const resourceCount: number = await prisma.teamResource.count({
                where: {
                    addedBy: {
                        voyageTeamId,
                    },
                },
            });

            await request(app.getHttpServer())
                .get(`/voyages/teams/${voyageTeamId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            {
                                ...resourceShape,
                                addedBy: expect.objectContaining({
                                    member: memberShape,
                                }),
                            },
                        ]),
                    );
                    expect(res.body).toHaveLength(resourceCount);
                });
        });

        it("should return 404 for invalid teamId", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const invalidTeamId = 99999;

            await request(app.getHttpServer())
                .get(`/voyages/teams/${invalidTeamId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });
        it("should return 401 when the user is not logged in", async () => {
            const voyageTeamId: number = 1;

            await request(app.getHttpServer())
                .get(`/voyages/teams/${voyageTeamId}`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401);
        });
        it("should return 401 and not allow users to GET other teams' resources", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const voyageTeamId: number = 2;
            await request(app.getHttpServer())
                .get(`/voyages/teams/${voyageTeamId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(401);
        });
    });

    describe("/PATCH :teamId/resources/:resourceId", () => {
        it("should return 200 and update a resource", async () => {
            const resourceToPatch = await findOwnResource(userEmail, prisma);
            const resourceId: number = resourceToPatch!.id;
            const patchedResource: UpdateResourceDto = {
                url: "http://www.github.com/chingu-x/chingu-dashboard-be",
                title: "Chingu Github BE repo",
            };

            await request(app.getHttpServer())
                .patch(`/voyages/resources/${resourceId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send(patchedResource)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect(async (res) => {
                    expect(res.body).toEqual({
                        ...resourceShape,
                    });
                    const updatedResource =
                        await prisma.teamResource.findUnique({
                            where: { id: resourceId },
                        });
                    expect(updatedResource?.url).toBe(patchedResource.url);
                    expect(updatedResource?.title).toBe(patchedResource.title);
                });
        });

        it("should return 404 for invalid resourceId", async () => {
            const invalidResourceId = 999;
            const patchedResource: UpdateResourceDto = {
                url: "http://www.github.com/chingu-x/chingu-dashboard-be",
                title: "Chingu Github BE repo",
            };

            await request(app.getHttpServer())
                .patch(`/voyages/resources/${invalidResourceId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send(patchedResource)
                .expect(404)
                .expect("Content-Type", /json/);
        });

        it("should return 400 for invalid request body", async () => {
            const resourceToPatch = await findOwnResource(userEmail, prisma);
            const resourceId: number = resourceToPatch!.id;
            const invalidResource = {
                url: "Chingu Github repo",
            };

            await request(app.getHttpServer())
                .patch(`/voyages/resources/${resourceId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send(invalidResource)
                .expect(400);
        });

        it("should return 401 if a user tries to PATCH a resource created by someone else", async () => {
            const resourceToPatch = await findOwnResource(userEmail, prisma);
            const resourceId: number = resourceToPatch!.id;
            const patchedResource: UpdateResourceDto = {
                url: "http://www.github.com/chingu-x/chingu-dashboard-be",
                title: "Chingu Github BE repo",
            };

            await request(app.getHttpServer())
                .patch(`/voyages/resources/${resourceId}`)
                .set("Authorization", `Bearer ${otherUserAccessToken}`)
                .send(patchedResource)
                .expect(401);
        });
    });

    describe("/DELETE :teamId/resources/:resourceId", () => {
        it("should return 200 after deleting a resource", async () => {
            const resourceToDelete = await findOwnResource(userEmail, prisma);
            const resourceId: number = resourceToDelete!.id;
            const initialResourceCount = await countResources(
                voyageTeamId,
                prisma,
            );

            await request(app.getHttpServer())
                .delete(`/voyages/resources/${resourceId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(200)
                .expect(async (res) => {
                    expect(res.body).toEqual({
                        ...resourceShape,
                    });
                    const updatedResourceCount = await countResources(
                        voyageTeamId,
                        prisma,
                    );
                    expect(updatedResourceCount).toBe(initialResourceCount - 1);

                    const deletedResource =
                        await prisma.teamResource.findUnique({
                            where: { id: resourceId },
                        });
                    expect(deletedResource).toBeNull();
                });
        });

        it("should return 404 for invalid resourceId", async () => {
            const invalidResourceId = 999;

            await request(app.getHttpServer())
                .delete(`/voyages/resources/${invalidResourceId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(404);
        });

        it("should return 400 for invalid request body", async () => {
            await request(app.getHttpServer())
                .delete(`/voyages/resources/rm -rf`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(400);
        });

        it("should return 401 if a user tries to DELETE a resource created by someone else", async () => {
            const resourceToDelete = await findOwnResource(userEmail, prisma);
            const resourceId: number = resourceToDelete!.id;

            await request(app.getHttpServer())
                .delete(`/voyages/resources/${resourceId}`)
                .set("Authorization", `Bearer ${otherUserAccessToken}`)
                .expect(401);
        });
    });
});
