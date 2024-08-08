import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { seed } from "../prisma/seed/seed";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { CreateResourceDto } from "src/resources/dto/create-resource.dto";
import { UpdateResourceDto } from "src/resources/dto/update-resource.dto";
import { loginAndGetTokens } from "./utils";
import { CASLForbiddenExceptionFilter } from "../src/exception-filters/casl-forbidden-exception.filter";
import * as cookieParser from "cookie-parser";

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

    const newResource: CreateResourceDto = {
        url: "http://www.github.com/chingux",
        title: "Chingu Github repo",
    };
    const patchedResource: UpdateResourceDto = {
        url: "http://www.github.com/chingu-x/chingu-dashboard-be",
        title: "Chingu Github BE repo",
    };
    const invalidResource = {
        title: "Chingu Github repo",
        url: "",
    };

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

            const voyageTeamId: number = 1;
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
            const voyageTeamId: number = 1;

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
            await request(app.getHttpServer())
                .post(`/voyages/teams/${invalidTeamId}`)
                .set("Cookie", [access_token, refresh_token])
                .send(newResource)
                .expect(404);
        });

        it("should return 401 when the is not looged in", async () => {
            const voyageTeamId: number = 1;

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
            const teamId: number = 1;

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
        it("should return 403 and not allow users to GET other teams' resources", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const voyageTeamId: number = 1;
            await request(app.getHttpServer())
                .get(`/voyages/teams/${voyageTeamId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });

    describe("/PATCH :teamId/resources/:resourceId", () => {
        it("should return 200 and update a resource", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const resourceToPatch = await findOwnResource(
                "dan@random.com",
                prisma,
            );
            const resourceId: number = resourceToPatch!.id;

            await request(app.getHttpServer())
                .patch(`/voyages/resources/${resourceId}`)
                .set("Cookie", [access_token, refresh_token])
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
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const invalidResourceId = 99999;

            await request(app.getHttpServer())
                .patch(`/voyages/resources/${invalidResourceId}`)
                .set("Cookie", [access_token, refresh_token])
                .send(patchedResource)
                .expect(404)
                .expect("Content-Type", /json/);
        });

        it("should return 400 for invalid request body", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const resourceToPatch = await findOwnResource(
                "dan@random.com",
                prisma,
            );
            const resourceId: number = resourceToPatch!.id;

            await request(app.getHttpServer())
                .patch(`/voyages/resources/${resourceId}`)
                .set("Cookie", [access_token, refresh_token])
                .send(invalidResource)
                .expect(400);
        });

        it("should return 401 when the user is not logged in", async () => {
            const resourceToPatch = await findOwnResource(
                "dan@random.com",
                prisma,
            );
            const resourceId: number = resourceToPatch!.id;
            await request(app.getHttpServer())
                .patch(`/voyages/resources/${resourceId}`)
                .set("Authorization", `${undefined}`)
                .send(patchedResource)
                .expect(401);
        });
        it("should return 403 when user of other member tries to patch a resource", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const resourceId: number = 1;

            await request(app.getHttpServer())
                .patch(`/voyages/resources/${resourceId}`)
                .set("Cookie", [access_token, refresh_token])
                .send(patchedResource)
                .expect(403);
        });
    });

    describe("/DELETE :teamId/resources/:resourceId", () => {
        it("should return 200 after deleting a resource", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const resourceToDelete = await findOwnResource(
                "dan@random.com",
                prisma,
            );
            const resourceId: number = resourceToDelete!.id;
            const voyageTeamId: number = 1;
            const initialResourceCount = await countResources(
                voyageTeamId,
                prisma,
            );

            await request(app.getHttpServer())
                .delete(`/voyages/resources/${resourceId}`)
                .set("Cookie", [access_token, refresh_token])
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
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            const invalidResourceId = 99999;

            await request(app.getHttpServer())
                .delete(`/voyages/resources/${invalidResourceId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });

        it("should return 400 for invalid request body", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .delete(`/voyages/resources/rm -rf`)
                .set("Cookie", [access_token, refresh_token])
                .expect(400);
        });

        it("should return 401 if a user is not logged in", async () => {
            const resourceToDelete = await findOwnResource(
                "dan@random.com",
                prisma,
            );
            const resourceId: number = resourceToDelete!.id;

            await request(app.getHttpServer())
                .delete(`/voyages/resources/${resourceId}`)
                .set("Authorization", `${undefined}`)
                .expect(401);
        });

        it("should return 403 when user of other member tries to delete a resource", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );

            const resourceId: number = 1;

            await request(app.getHttpServer())
                .delete(`/voyages/resources/${resourceId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });
});
