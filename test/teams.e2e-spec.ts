import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { User, Voyage, VoyageTeam } from "@prisma/client";
import * as bcrypt from "bcrypt";

const roundsOfHashing = 10;

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, roundsOfHashing);
};

describe("TeamsController (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    const teamShape = expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        repoUrl: expect.any(String),
        endDate: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
    });
    const memberShape = expect.objectContaining({
        hrPerSprint: expect.any(Number),
    });

    let newUser: User;
    let newVoyage: Voyage;
    let newVoyageTeam: VoyageTeam;
    let newUserAccessToken: string;

    async function truncate() {
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
        newVoyage = await prisma.voyage.create({
            data: {
                number: "47",
                startDate: new Date("2024-10-28"),
                endDate: new Date("2024-11-09"),
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
        await prisma.voyageTeamMember.create({
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
        await request(app.getHttpServer())
            .post("/auth/login")
            .send({
                email: newUser.email,
                password: "password",
            })
            .expect(201)
            .then((res) => {
                newUserAccessToken = res.body.access_token;
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

    beforeEach(async () => {
        await reseed();
    });

    afterAll(async () => {
        await truncate();

        await prisma.$disconnect();
        await app.close();
    });

    it("/GET teams", async () => {
        const teamCount: number = await prisma.voyageTeam.count();

        return request(app.getHttpServer())
            .get("/teams")
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual(expect.arrayContaining([teamShape]));
                expect(res.body).toHaveLength(teamCount);
            });
    });

    it("/GET teams/voyages/:id", async () => {
        const voyageId: number = newVoyage.id;
        const teamCount: number = await prisma.voyageTeam.count({
            where: {
                voyageId: voyageId,
            },
        });

        return request(app.getHttpServer())
            .get(`/teams/voyages/${voyageId}`)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual(expect.arrayContaining([teamShape]));
                expect(res.body).toHaveLength(teamCount);
            });
    });

    it("/GET teams/:id/members", async () => {
        const teamId: number = newVoyageTeam.id;
        const memberCount: number = await prisma.voyageTeamMember.count({
            where: {
                voyageTeamId: teamId,
            },
        });

        return request(app.getHttpServer())
            .get(`/teams/${teamId}/members`)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual(expect.arrayContaining([memberShape]));
                expect(res.body).toHaveLength(memberCount);
            });
    });

    it("/PATCH teams/:teamId/members", async () => {
        const teamId: number = newVoyageTeam.id;
        const randomHours: number = Math.floor(Math.random() * 31);
        const updatedData = {
            hrPerSprint: randomHours,
        };

        return request(app.getHttpServer())
            .patch(`/teams/${teamId}/members`)
            .set("Authorization", `Bearer ${newUserAccessToken}`)
            .send(updatedData)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual(memberShape);
                expect(res.body.hrPerSprint).toEqual(randomHours);
            });
    });
});
