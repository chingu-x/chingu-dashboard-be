import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { seed } from "../prisma/seed/seed";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { CreateResourceDto } from "src/resources/dto/create-resource.dto";
import { UpdateResourceDto } from "src/resources/dto/update-resource.dto";
import { extractResCookieValueByKey } from "./utils";

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

describe("ResourcesController (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    const memberShape = {
        avatar: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
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
        await app.init();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    describe("/POST voyages/:teamId/resources", () => {
        it("should create a new resource", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const userAccessToken = await loginUser(userEmail, "password", app);

            const newResource: CreateResourceDto = {
                url: "http://www.github.com/chingux",
                title: "Chingu Github repo",
            };

            return request(app.getHttpServer())
                .post(`/voyages/${voyageTeamId}/resources`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send(newResource)
                .expect(201)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual({
                        ...resourceShape,
                    });
                });
        });

        it("should not allow members of other teams to POST", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const otherUserEmail: string = "JosoMadar@dayrep.com";
            const otherUserAccessToken = await loginUser(
                otherUserEmail,
                "password",
                app,
            );
            const { voyageTeamId: otherVoyageTeamId } = await findVoyageTeamId(
                otherUserEmail,
                prisma,
            );

            const newResource: CreateResourceDto = {
                url: "http://www.github.com/chingux",
                title: "Chingu Github repo",
            };

            if (voyageTeamId === otherVoyageTeamId) {
                throw new Error("Voyage team IDs should be different");
            }

            return request(app.getHttpServer())
                .post(`/voyages/${voyageTeamId}/resources`)
                .set("Authorization", `Bearer ${otherUserAccessToken}`)
                .send(newResource)
                .expect(401);
        });

        it("should return 400 for invalid request body", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const userAccessToken = await loginUser(userEmail, "password", app);

            const invalidResource = {
                title: "Chingu Github repo",
            };

            return request(app.getHttpServer())
                .post(`/voyages/${voyageTeamId}/resources`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send(invalidResource)
                .expect(400);
        });

        it("should return 404 for invalid teamId", async () => {
            const userEmail: string = "dan@random.com";
            const userAccessToken = await loginUser(userEmail, "password", app);
            const invalidTeamId = 999;

            const newResource: CreateResourceDto = {
                url: "http://www.github.com/chingux",
                title: "Chingu Github repo",
            };

            return request(app.getHttpServer())
                .post(`/voyages/${invalidTeamId}/resources`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send(newResource)
                .expect(404);
        });
    });

    describe("/GET voyages/:teamId/resources", () => {
        it("should get resources for the team", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const userAccessToken = await loginUser(userEmail, "password", app);

            const resourceCount: number = await prisma.teamResource.count({
                where: {
                    addedBy: {
                        voyageTeamId,
                    },
                },
            });

            return request(app.getHttpServer())
                .get(`/voyages/${voyageTeamId}/resources`)
                .set("Authorization", `Bearer ${userAccessToken}`)
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

        it("should not allow users to GET other teams' resources", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const otherUserEmail: string = "JosoMadar@dayrep.com";
            const otherUserAccessToken = await loginUser(
                otherUserEmail,
                "password",
                app,
            );
            const { voyageTeamId: otherVoyageTeamId } = await findVoyageTeamId(
                otherUserEmail,
                prisma,
            );

            if (voyageTeamId === otherVoyageTeamId) {
                throw new Error("Voyage team IDs should be different");
            }

            return request(app.getHttpServer())
                .get(`/voyages/${voyageTeamId}/resources`)
                .set("Authorization", `Bearer ${otherUserAccessToken}`)
                .expect(401);
        });

        it("should return 404 for invalid teamId", async () => {
            const userEmail: string = "dan@random.com";
            const userAccessToken = await loginUser(userEmail, "password", app);
            const invalidTeamId = 999;

            return request(app.getHttpServer())
                .get(`/voyages/${invalidTeamId}/resources`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(404);
        });
    });

    describe("/PATCH :teamId/resources/:resourceId", () => {
        it("should update a resource", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const userAccessToken = await loginUser(userEmail, "password", app);

            const resourceToPatch = await findOwnResource(userEmail, prisma);

            const resourceId: number = resourceToPatch.id;
            const patchedResource: UpdateResourceDto = {
                url: "http://www.github.com/chingu-x/chingu-dashboard-be",
                title: "Chingu Github BE repo",
            };

            return request(app.getHttpServer())
                .patch(`/voyages/${voyageTeamId}/resources/${resourceId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send(patchedResource)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual({
                        ...resourceShape,
                    });
                });
        });

        it("should only allow resource creator to PATCH", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const otherUserEmail: string = "JosoMadar@dayrep.com";
            const otherUserAccessToken = await loginUser(
                otherUserEmail,
                "password",
                app,
            );

            const resourceToPatch = await findOwnResource(userEmail, prisma);

            const resourceId: number = resourceToPatch.id;
            const patchedResource: UpdateResourceDto = {
                url: "http://www.github.com/chingu-x/chingu-dashboard-be",
                title: "Chingu Github BE repo",
            };

            return request(app.getHttpServer())
                .patch(`/voyages/${voyageTeamId}/resources/${resourceId}`)
                .set("Authorization", `Bearer ${otherUserAccessToken}`)
                .send(patchedResource)
                .expect(401);
        });

        it("should return 404 for invalid resourceId", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const userAccessToken = await loginUser(userEmail, "password", app);

            const invalidResourceId = 999;
            const patchedResource: UpdateResourceDto = {
                url: "http://www.github.com/chingu-x/chingu-dashboard-be",
                title: "Chingu Github BE repo",
            };

            return request(app.getHttpServer())
                .patch(
                    `/voyages/${voyageTeamId}/resources/${invalidResourceId}`,
                )
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send(patchedResource)
                .expect(404)
                .expect("Content-Type", /json/);
        });

        it("should return 400 for invalid request body", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const userAccessToken = await loginUser(userEmail, "password", app);

            const resourceToPatch = await findOwnResource(userEmail, prisma);

            const resourceId: number = resourceToPatch.id;

            const invalidResource = {
                url: "Chingu Github repo",
            };

            return request(app.getHttpServer())
                .patch(`/voyages/${voyageTeamId}/resources/${resourceId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send(invalidResource)
                .expect(400);
        });
    });

    describe("/DELETE :teamId/resources/:resourceId", () => {
        it("should delete a resource", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const userAccessToken = await loginUser(userEmail, "password", app);

            const resourceToDelete = await findOwnResource(userEmail, prisma);

            const resourceId: number = resourceToDelete.id;

            return request(app.getHttpServer())
                .delete(`/voyages/${voyageTeamId}/resources/${resourceId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect((res) => {
                    expect(res.body).toEqual({
                        ...resourceShape,
                    });
                });
        });

        it("should only allow resource creator to DELETE", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const otherUserEmail: string = "JosoMadar@dayrep.com";
            const otherUserAccessToken = await loginUser(
                otherUserEmail,
                "password",
                app,
            );

            const resourceToDelete = await findOwnResource(userEmail, prisma);

            const resourceId: number = resourceToDelete.id;

            return request(app.getHttpServer())
                .delete(`/voyages/${voyageTeamId}/resources/${resourceId}`)
                .set("Authorization", `Bearer ${otherUserAccessToken}`)
                .expect(401);
        });

        it("should return 404 for invalid resourceId", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const userAccessToken = await loginUser(userEmail, "password", app);

            const invalidResourceId = 999;

            return request(app.getHttpServer())
                .delete(
                    `/voyages/${voyageTeamId}/resources/${invalidResourceId}`,
                )
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(404);
        });

        it("should return 400 for invalid request body", async () => {
            const userEmail: string = "dan@random.com";
            const { voyageTeamId } = await findVoyageTeamId(userEmail, prisma);

            const userAccessToken = await loginUser(userEmail, "password", app);

            return request(app.getHttpServer())
                .delete(`/voyages/${voyageTeamId}/resources/rm -rf`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(400);
        });
    });
});
