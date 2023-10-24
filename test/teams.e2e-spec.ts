import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("TeamsController (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    const teamShape = expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        repoUrl: expect.any(String),
        endDate: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
    });
    const memberShape = expect.objectContaining({
        hrPerSprint: expect.any(Number),
    });

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        await app.init();
    });

    afterAll(async () => {
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

    it("/GET teams/voyage/:id", async () => {
        const voyageId: number = 2;
        const teamCount: number = await prisma.voyageTeam.count({
            where: {
                voyageId: voyageId,
            },
        });

        return request(app.getHttpServer())
            .get(`/teams/voyage/${voyageId}`)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual(expect.arrayContaining([teamShape]));
                expect(res.body).toHaveLength(teamCount);
            });
    });

    it("/GET teams/:id/members", async () => {
        const teamId: number = 1;
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

    it("/PATCH teams/:teamId/member/:userId", async () => {
        const teamId: number = 1;
        const voyageTeam = await prisma.voyageTeam.findFirst({
            where: {
                id: teamId,
            },
            select: {
                voyageTeamMembers: true,
            },
        });
        const firstTeamMember = voyageTeam.voyageTeamMembers.find(
            (member: {id: number}) => member.id === 1,
        )
        const randomHours: Number = Math.floor(Math.random() * 31);
        const updatedData = {
            hrPerSprint: randomHours,
        };

        return request(app.getHttpServer())
            .patch(`/teams/${teamId}/member/${firstTeamMember.userId}`)
            .send(updatedData)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                console.log(res.body);
                expect(res.body).toEqual(memberShape);
                expect(res.body.hrPerSprint).toEqual(randomHours);
            });
    });
});