import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { seed } from "../prisma/seed/seed";
import { extractResCookieValueByKey } from "./utils";
const newTechName = "anotherLayerJS";

//Tests require the following state and seed data to execute successfully:
//Logged in as user Jessica Williamson, member of voyage team 2, as team member 8
//Team 2 must have at least one tech in category 1 , with at least one vote
//Tech item 3 has not been been voted on by team member 8

describe("Techs Controller (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let userAccessToken: string;

    async function loginUser() {
        await request(app.getHttpServer())
            .post("/auth/login")
            .send({
                email: "jessica.williamson@gmail.com",
                password: "password",
            })
            .expect(200)
            .then((res) => {
                userAccessToken = extractResCookieValueByKey(
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
        await app.init();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    beforeEach(async () => {
        await loginUser();
    });
    describe("voyages/:teamId/techs", () => {
        it("GET - 200 returns array of tech categories, populated with techs and votes", async () => {
            const teamId: number = 2;

            return await request(app.getHttpServer())
                .get(`/voyages/${teamId}/techs`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            //main response body array
                            {
                                id: expect.any(Number),
                                name: expect.any(String),
                                description: expect.any(String),
                                teamTechStackItems: expect.any(Array),
                            },
                        ]),
                    );
                })
                .expect((res) => {
                    expect(res.body[0].teamTechStackItems).toEqual(
                        //nested teamTechStackItems array
                        expect.arrayContaining([
                            {
                                id: expect.any(Number),
                                name: expect.any(String),
                                teamTechStackItemVotes: expect.any(Array),
                            },
                        ]),
                    );
                })
                .expect((res) => {
                    expect(
                        res.body[0].teamTechStackItems[0]
                            .teamTechStackItemVotes,
                    ).toEqual(
                        //nested teamTechStackItemsVotes array
                        expect.arrayContaining([
                            {
                                votedBy: {
                                    member: {
                                        id: expect.any(String),
                                        firstName: expect.any(String),
                                        lastName: expect.any(String),
                                        avatar: expect.any(String),
                                    },
                                },
                            },
                        ]),
                    );
                });
        });

        it("POST - 201 adds new tech", async () => {
            const teamId: number = 2;

            return request(app.getHttpServer())
                .post(`/voyages/${teamId}/techs`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    techName: newTechName,
                    techCategoryId: 1,
                })
                .expect(201)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            teamTechId: expect.any(Number),
                            teamMemberId: expect.any(Number),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        }),
                    );
                });
        });

        it("    verify that new tech is present in database", async () => {
            const techStackItem = await prisma.teamTechStackItem.findMany({
                where: {
                    name: newTechName,
                    categoryId: 1,
                },
            });
            return expect(techStackItem[0].name).toEqual(newTechName);
        });

        it("POST - 401 not logged in, unauthorized", async () => {
            const teamId: number = 2;

            return request(app.getHttpServer())
                .post(`/voyages/${teamId}/techs`)
                .set("Authorization", `Bearer ${undefined}`)
                .send({
                    techName: newTechName,
                    techCategoryId: 1,
                })
                .expect(401)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            message: "Unauthorized",
                            statusCode: 401,
                        }),
                    );
                });
        });

        it("POST - 400 invalid teamId", async () => {
            const teamId: number = 9999999;

            return request(app.getHttpServer())
                .post(`/voyages/${teamId}/techs`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    techName: newTechName,
                    techCategoryId: 1,
                })
                .expect(400)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            message: expect.any(String),
                            error: expect.any(String),
                            statusCode: 400,
                        }),
                    );
                });
        });

        it("POST - 409 tech already exists in database", async () => {
            const teamId: number = 2;

            return request(app.getHttpServer())
                .post(`/voyages/${teamId}/techs`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    techName: newTechName,
                    techCategoryId: 1,
                })
                .expect(409)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            error: "Conflict",
                            message: expect.any(String),
                            statusCode: 409,
                        }),
                    );
                });
        });
    });

    describe("voyages/:teamId/techs/:teamTechId", () => {
        it("POST - 200 vote for tech", async () => {
            const teamId: number = 2;
            const techId: number = 3;

            return request(app.getHttpServer())
                .post(`/voyages/${teamId}/techs/${techId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(201)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            teamTechId: expect.any(Number),
                            teamMemberId: expect.any(Number),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        }),
                    );
                });
        });

        it("    verify that new tech vote is present in database", async () => {
            const techStackVote = await prisma.teamTechStackItemVote.findMany({
                where: {
                    teamTechId: 3,
                    teamMemberId: 8,
                },
            });
            return expect(techStackVote[0].teamMemberId).toEqual(8);
        });

        it("POST - 401 not logged in, unauthorized", async () => {
            const teamId: number = 2;
            const techId: number = 3;

            return request(app.getHttpServer())
                .post(`/voyages/${teamId}/techs/${techId}`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            message: "Unauthorized",
                            statusCode: 401,
                        }),
                    );
                });
        });

        it("POST - 400 invalid teamId", async () => {
            const teamId: number = 9999999;
            const techId: number = 3;

            return request(app.getHttpServer())
                .post(`/voyages/${teamId}/techs/${techId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(400)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            message: expect.any(String),
                            error: expect.any(String),
                            statusCode: 400,
                        }),
                    );
                });
        });

        it("POST - 409 vote for tech already exists", async () => {
            const teamId: number = 2;
            const techId: number = 3;

            return request(app.getHttpServer())
                .post(`/voyages/${teamId}/techs/${techId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(409)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            message: expect.any(String),
                            error: "Conflict",
                            statusCode: 409,
                        }),
                    );
                });
        });
    });

    describe("voyages/:teamId/techs/:teamTechId", () => {
        it("DELETE - 200 tech vote deleted", async () => {
            const teamId: number = 2;
            const techId: number = 3;

            return request(app.getHttpServer())
                .delete(`/voyages/${teamId}/techs/${techId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            teamTechId: expect.any(Number),
                            teamMemberId: expect.any(Number),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        }),
                    );
                });
        });

        it("    verify that new tech vote is deleted from database", async () => {
            const techStackVote = await prisma.teamTechStackItemVote.findMany({
                where: {
                    teamTechId: 3,
                    teamMemberId: 8,
                },
            });
            return expect(techStackVote[0]).toEqual(undefined);
        });

        it("DELETE - 401 not logged in, unauthorized", async () => {
            const teamId: number = 2;
            const techId: number = 3;

            return request(app.getHttpServer())
                .delete(`/voyages/${teamId}/techs/${techId}`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            message: "Unauthorized",
                            statusCode: 401,
                        }),
                    );
                });
        });

        it("DELETE - 400 invalid teamId", async () => {
            const teamId: number = 99999;
            const techId: number = 3;

            return request(app.getHttpServer())
                .delete(`/voyages/${teamId}/techs/${techId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(400)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            message: expect.any(String),
                            error: "Bad Request",
                            statusCode: 400,
                        }),
                    );
                });
        });

        it("DELETE - 404 vote to delete does not exist", async () => {
            const teamId: number = 2;
            const techId: number = 3;

            return request(app.getHttpServer())
                .delete(`/voyages/${teamId}/techs/${techId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(404)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            message: "Record to delete does not exist.",
                            error: "Not Found",
                            statusCode: 404,
                        }),
                    );
                });
        });
    });

    describe("PATCH voyages/:teamId/techs/selections - updates isSelected value of tech stack items", () => {
        it("should return 200 and an array of updated techs, if successful", async () => {
            const teamId: number = 2;

            return request(app.getHttpServer())
                .patch(`/voyages/${teamId}/techs/selections`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    categories: [
                        {
                            categoryId: 1,
                            techs: [
                                {
                                    techId: 1,
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                })
                .expect(200)
                .expect("Content-Type", /json/);
            // .expect((res) => {
            //     expect(res.body).toEqual(
            //         expect.objectContaining({
            //             id: expect.any(Number),
            //             teamTechId: expect.any(Number),
            //             teamMemberId: expect.any(Number),
            //             createdAt: expect.any(String),
            //             updatedAt: expect.any(String),
            //         }),
            //     );
            // });
        });

        it("should return 401 if no valid user token", async () => {
            const teamId: number = 2;

            return request(app.getHttpServer())
                .patch(`/voyages/${teamId}/techs/selections`)
                .set("Authorization", `Bearer ${undefined}`)
                .send({
                    categories: [
                        {
                            categoryId: 1,
                            techs: [
                                {
                                    techId: 1,
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                })
                .expect(401);
        });
    });
});
