jest.setTimeout(70000)

import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import {
    TeamResource,
    User,
    Voyage,
    VoyageTeam,
    VoyageTeamMember,
} from "@prisma/client";
import { CreateResourceDto } from "src/resources/dto/create-resource.dto";
import { UpdateResourceDto } from "src/resources/dto/update-resource.dto";
import * as bcrypt from "bcrypt";
import { extractResCookieValueByKey } from "./utils";

const roundsOfHashing = 10;

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, roundsOfHashing);
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

    let newResource: TeamResource;
    let newUser1: User;
    let newUser2: User;
    let newUser3: User;
    let newVoyage: Voyage;
    let newVoyageTeam: VoyageTeam;
    let otherVoyageTeam: VoyageTeam;
    let newVoyageTeamMember: VoyageTeamMember;
    let otherVoyageTeamMember: VoyageTeamMember;
    let memberOfOtherVoyageTeam: VoyageTeamMember;
    let newUserAccessToken: string;
    let otherUserAccessToken: string;

    async function truncate() {
        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "TeamResource" RESTART IDENTITY CASCADE;`,
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
        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`,
        );
    }

    async function reseed() {
        await truncate();

        newUser1 = await prisma.user.create({
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
        newUser2 = await prisma.user.create({
            data: {
                firstName: "Test",
                lastName: "User2",
                githubId: "testuser-github",
                discordId: "testuser-discord",
                email: "testuser2@outlook.com",
                password: await hashPassword("password"),
                avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=monsterid&r=x",
                timezone: "America/Los_Angeles",
                comment: "Member seems to be inactive",
                countryCode: "US",
            },
        });
        newUser3 = await prisma.user.create({
            data: {
                firstName: "Test",
                lastName: "User3",
                githubId: "testuser-github",
                discordId: "testuser-discord",
                email: "testuser3@outlook.com",
                password: await hashPassword("password"),
                avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=monsterid&r=x",
                timezone: "America/Los_Angeles",
                comment: "Member seems to be inactive",
                countryCode: "US",
            },
        });
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
                    "https://github.com/chingu-voyages/tier3-chinguweather",
                endDate: new Date("2024-11-09"),
            },
        });
        otherVoyageTeam = await prisma.voyageTeam.create({
            data: {
                voyage: {
                    connect: { number: newVoyage.number },
                },
                name: "v47-other-team",
                repoUrl:
                    "https://github.com/chingu-voyages/tier3-chingujournal",
                endDate: new Date("2024-11-09"),
            },
        });
        newVoyageTeamMember = await prisma.voyageTeamMember.create({
            data: {
                member: {
                    connect: {
                        id: newUser1.id,
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
        otherVoyageTeamMember = await prisma.voyageTeamMember.create({
            data: {
                member: {
                    connect: {
                        id: newUser2.id,
                    },
                },
                voyageTeam: {
                    connect: {
                        id: otherVoyageTeam.id,
                    },
                },
                hrPerSprint: 10.5,
            },
        });
        memberOfOtherVoyageTeam = await prisma.voyageTeamMember.create({
            data: {
                member: {
                    connect: {
                        id: newUser2.id,
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
        newResource = await prisma.teamResource.create({
            data: {
                url: "http://www.github.com",
                title: "Github",
                addedBy: {
                    connect: {
                        id: newVoyageTeamMember.id,
                        userId: newUser1.id,
                    },
                },
            },
        });

        await request(app.getHttpServer())
            .post("/auth/login")
            .send({
                email: newUser1.email,
                password: "password",
            })
            .expect(200)
            .then((res) => {
                newUserAccessToken = extractResCookieValueByKey(
                    res.headers["set-cookie"],
                    "access_token",
                );
            });
        
        await request(app.getHttpServer())
        .post("/auth/login")
        .send({
            email: newUser3.email,
            password: "password",
        })
        .expect(200)
        .then((res) => {
            otherUserAccessToken = extractResCookieValueByKey(
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
    });

    afterAll(async () => {
        await truncate();

        await prisma.$disconnect();
        await app.close();
    });

    beforeEach(async () => {
        await reseed();
    });

    it("/POST voyages/:teamId/resources", async () => {
        

        const teamId: number = newVoyageTeam.id;
        const otherNewResource: CreateResourceDto = {
            url: "http://www.github.com/chingux",
            title: "Chingu Github repo"
        };

        return request(app.getHttpServer())
            .post(`/voyages/${teamId}/resources`)
            .set("Authorization", `Bearer ${newUserAccessToken}`)
            .send(otherNewResource)
            .expect(201)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual({
                    ...resourceShape,
                });
            });
    });


    it("/GET voyages/:teamId/resources", async () => {
        const teamId: number = newVoyageTeam.id;
        const resourceCount: number = await prisma.teamResource.count({
            where: {
                addedBy: {
                    voyageTeamId: teamId,
                },
            },
        });

        return request(app.getHttpServer())
            .get(`/voyages/${teamId}/resources`)
            .set("Authorization", `Bearer ${newUserAccessToken}`)
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

    it("/PATCH :teamId/resources/:resourceId", async () => {
        const teamId: number = newVoyageTeam.id;
        const resourceId: number = newResource.id;
        const otherNewResource: UpdateResourceDto = {
            url: "http://www.github.com/chingu-x/chingu-dashboard-be",
            title: "Chingu Github BE repo"
        };

        return request(app.getHttpServer())
            .patch(`/voyages/${teamId}/resources/${resourceId}`)
            .set("Authorization", `Bearer ${newUserAccessToken}`)
            .send(otherNewResource)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual({
                    ...resourceShape,
                });
            });
    });

    it("should only allow resource creator to patch", async () => {
        const teamId: number = newVoyageTeam.id;
        const resourceId: number = newResource.id;

        return request(app.getHttpServer())
            .patch(`/voyages/${teamId}/resources/${resourceId}`)
            .set("Authorization", `Bearer ${otherUserAccessToken}`)
            .expect(401);
    });

    it("/DELETE :teamId/resources/:resourceId", async () => {
        const teamId: number = newVoyageTeam.id;
        const resourceId: number = newResource.id;

        return request(app.getHttpServer())
            .delete(`/voyages/${teamId}/resources/${resourceId}`)
            .set("Authorization", `Bearer ${newUserAccessToken}`)
            .expect((res) => {
                expect(res.body).toEqual({
                    ...resourceShape,
                });
            });
    });

    it("should only allow resource creator to delete", async () => {
        const teamId: number = newVoyageTeam.id;
        const resourceId: number = newResource.id;

        return request(app.getHttpServer())
            .delete(`/voyages/${teamId}/resources/${resourceId}`)
            .set("Authorization", `Bearer ${otherUserAccessToken}`)
            .expect(401);
    });

});
