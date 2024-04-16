import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import {
    ProjectIdea,
    ProjectIdeaVote,
    User,
    Voyage,
    VoyageTeam,
    VoyageTeamMember,
} from "@prisma/client";
import { UpdateIdeationDto } from "src/ideations/dto/update-ideation.dto";
import { CreateIdeationDto } from "src/ideations/dto/create-ideation.dto";
import * as bcrypt from "bcrypt";
import { extractResCookieValueByKey } from "./utils";

const roundsOfHashing = 10;

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, roundsOfHashing);
};

describe("IdeationsController (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    const memberShape = {
        id: expect.any(String),
        avatar: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
    };
    const ideationVoteShape = {
        id: expect.any(Number),
        createdAt: expect.any(String),
        voyageTeamMemberId: expect.any(Number),
        projectIdeaId: expect.any(Number),
        updatedAt: expect.any(String),
    };
    const ideationShape = {
        id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        vision: expect.any(String),
        isSelected: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
    };

    let newIdeation: ProjectIdea;
    let newIdeationVote: ProjectIdeaVote;
    let newUser: User;
    let newVoyage: Voyage;
    let newVoyageTeam: VoyageTeam;
    let newVoyageTeamMember: VoyageTeamMember;
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

    async function truncate() {
        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "ProjectIdeaVote" RESTART IDENTITY CASCADE;`,
        );
        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "ProjectIdea" RESTART IDENTITY CASCADE;`,
        );
        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "VoyageTeamMember" RESTART IDENTITY CASCADE;`,
        );
        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "VoyageTeam" RESTART IDENTITY CASCADE;`,
        );
        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "Voyage" RESTART IDENTITY CASCADE;`,
        );
        // await prisma.$executeRawUnsafe(
        //     `TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`,
        // );
    }

    async function reseed() {
        await truncate();

        newVoyage = await prisma.voyage.create({
            data: {
                number: "47",
                startDate: new Date("2024-10-28"),
                endDate: new Date("2024-11-09"),
                soloProjectDeadline: new Date("2023-12-31"),
                certificateIssueDate: new Date("2024-02-25"),
            },
        });
        newVoyageTeam = await prisma.voyageTeam.create({
            data: {
                voyage: {
                    connect: { number: newVoyage.number },
                },
                name: "v47-team-test",
                repoUrl:
                    "https://github.com/chingu-voyages/soloproject-tier3-chinguweather",
                endDate: new Date("2024-11-09"),
            },
        });
        newVoyageTeamMember = await prisma.voyageTeamMember.create({
            data: {
                member: {
                    connect: {
                        id: newUser.id,
                    },
                },
                voyageTeam: {
                    connect: {
                        id: newVoyageTeam.id,
                    },
                },
                hrPerSprint: 10.5,
            },
        });
        newIdeation = await prisma.projectIdea.create({
            data: {
                title: "Ideation 1",
                description: "Ideation 1 description",
                vision: "Ideation 1 vision",
                contributedBy: {
                    connect: {
                        id: newVoyageTeamMember.id,
                        userId: newUser.id,
                    },
                },
            },
        });
        newIdeationVote = await prisma.projectIdeaVote.create({
            data: {
                votedBy: {
                    connect: {
                        id: newVoyageTeamMember.id,
                        userId: newUser.id,
                    },
                },
                projectIdea: {
                    connect: {
                        id: newIdeation.id,
                    },
                },
            },
        });
        await request(app.getHttpServer())
            .post("/auth/login")
            .send({
                email: newUser.email,
                password: "password",
            })
            .expect(200)
            .then((res) => {
                newUserAccessToken = extractResCookieValueByKey(
                    res.headers["set-cookie"],
                    "access_token",
                );
            });
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
        try {
            newUser = await prisma.user.create({
                data: {
                    firstName: "Test",
                    lastName: "User",
                    githubId: "testuser-github",
                    discordId: "testuser-discord",
                    email: "testuser@outlook.com",
                    password: await hashPassword("password"),
                    avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=monsterid&r=x",
                    timezone: "America/Los_Angeles",
                    comment: "Member seems to be inactive",
                    countryCode: "US",
                },
            });
        } catch (e) {
            newUser = await prisma.user.findFirst({
                where: {
                    firstName: "Test",
                    lastName: "User",
                },
            });
        }
    });

    afterAll(async () => {
        await reseed();

        await prisma.$disconnect();
        await app.close();
    });

    beforeEach(async () => {
        await reseed();
    });

    it("/POST voyages/teams/:teamId/ideations", async () => {
        await prisma.projectIdea.delete({
            where: {
                id: newIdeation.id,
            },
        });

        const teamId: number = newVoyageTeam.id;
        const createIdeationDto: CreateIdeationDto = {
            title: "Ideation 1",
            description: "Ideation 1 description",
            vision: "Ideation 1 vision",
        };

        return request(app.getHttpServer())
            .post(`/voyages/teams/${teamId}/ideations`)
            .set("Authorization", `Bearer ${newUserAccessToken}`)
            .send(createIdeationDto)
            .expect(201)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual({
                    ...ideationShape,
                    updatedAt: expect.any(String),
                    voyageTeamMemberId: expect.any(Number),
                });
            });
    });

    it("/POST voyages/teams/:teamId/ideations/:ideationId/ideation-votes", async () => {
        await prisma.projectIdeaVote.delete({
            where: {
                id: newIdeationVote.id,
            },
        });

        const teamId: number = newVoyageTeam.id;
        const ideationId: number = newIdeation.id;

        return request(app.getHttpServer())
            .post(
                `/voyages/teams/${teamId}/ideations/${ideationId}/ideation-votes`,
            )
            .set("Authorization", `Bearer ${newUserAccessToken}`)
            .expect(201)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual(ideationVoteShape);
            });
    });

    it("/GET voyages/teams/:teamId/ideations", async () => {
        const teamId: number = newVoyageTeam.id;
        const ideationCount: number = await prisma.projectIdea.count({
            where: {
                contributedBy: {
                    voyageTeamId: teamId,
                },
            },
        });

        return request(app.getHttpServer())
            .get(`/voyages/teams/${teamId}/ideations`)
            .set("Authorization", `Bearer ${newUserAccessToken}`)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual(
                    expect.arrayContaining([
                        {
                            ...ideationShape,
                            contributedBy: expect.objectContaining({
                                member: memberShape,
                            }),
                            projectIdeaVotes: expect.any(Array),
                        },
                    ]),
                );
                expect(res.body).toHaveLength(ideationCount);
            });
    });

    it("/PATCH /teams/:teamId/ideations/:ideationId", async () => {
        const teamId: number = newVoyageTeam.id;
        const ideationId: number = newIdeation.id;
        const updateIdeationDto: UpdateIdeationDto = {
            title: "Ideation 2",
            description: "Ideation 2 description",
            vision: "Ideation 2 vision",
        };

        return request(app.getHttpServer())
            .patch(`/voyages/teams/${teamId}/ideations/${ideationId}`)
            .set("Authorization", `Bearer ${newUserAccessToken}`)
            .send(updateIdeationDto)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual({
                    ...ideationShape,
                    voyageTeamMemberId: expect.any(Number),
                    updatedAt: expect.any(String),
                });
            });
    });

    it("/DELETE /teams/:teamId/ideations/:ideationId", async () => {
        const teamId: number = newVoyageTeam.id;
        const ideationId: number = newIdeation.id;

        return request(app.getHttpServer())
            .delete(`/voyages/teams/${teamId}/ideations/${ideationId}`)
            .set("Authorization", `Bearer ${newUserAccessToken}`)
            .expect((res) => {
                expect(res.body).toEqual({
                    ...ideationShape,
                    voyageTeamMemberId: expect.any(Number),
                    updatedAt: expect.any(String),
                });
            });
    });

    it("/DELETE voyages/teams/:teamId/ideations/:ideationId/ideation-votes", async () => {
        const teamId: number = newVoyageTeam.id;
        const ideationId: number = newIdeation.id;

        return request(app.getHttpServer())
            .delete(
                `/voyages/teams/${teamId}/ideations/${ideationId}/ideation-votes`,
            )
            .set("Authorization", `Bearer ${newUserAccessToken}`)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual(ideationVoteShape);
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
