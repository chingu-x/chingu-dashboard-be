import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import {
    ProjectIdea,
    ProjectIdeaVote,
    User,
    VoyageTeam,
    VoyageTeamMember,
} from "@prisma/client";
import { CreateIdeationVoteDto } from "src/ideations/dto/create-ideation-vote.dto";
import { DeleteIdeationDto } from "src/ideations/dto/delete-ideation.dto";
import { UpdateIdeationDto } from "src/ideations/dto/update-ideation.dto";
import { CreateIdeationDto } from "src/ideations/dto/create-ideation.dto";
import { DeleteIdeationVoteDto } from "src/ideations/dto/delete-ideation-vote.dto";

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
        createdAt: expect.any(String),
    };

    let newIdeation: ProjectIdea;
    let newIdeationVote: ProjectIdeaVote;
    let newUser: User;
    let newVoyageTeam: VoyageTeam;
    let newVoyageTeamMember: VoyageTeamMember;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        newUser = await prisma.user.create({
            data: {
                firstName: "Test",
                lastName: "User",
                githubId: "testuser-github",
                discordId: "testuser-discord",
                email: "testuser@outlook.com",
                password: "password",
                avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=monsterid&r=x",
                timezone: "America/Los_Angeles",
                comment: "Member seems to be inactive",
                countryCode: "US",
                gender: {
                    connect: {
                        abbreviation: "M",
                    },
                },
            },
        });
        newVoyageTeam = await prisma.voyageTeam.create({
            data: {
                voyage: {
                    connect: { number: "47" },
                },
                name: "v47-tier3-team-test",
                status: {
                    connect: {
                        name: "Active",
                    },
                },
                repoUrl:
                    "https://github.com/chingu-voyages/soloproject-tier3-chinguweather",
                tier: {
                    connect: { name: "Tier 2" },
                },
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
                status: {
                    connect: {
                        name: "Active",
                    },
                },
                hrPerSprint: 10.5,
            },
        });
    });

    afterAll(async () => {
        await prisma.voyageTeamMember.delete({
            where: {
                id: newVoyageTeamMember.id,
            },
        });
        await prisma.voyageTeam.delete({
            where: {
                id: newVoyageTeam.id,
            },
        });
        await prisma.user.delete({
            where: {
                id: newUser.id,
            },
        });

        await prisma.$disconnect();
        await app.close();
    });

    beforeEach(async () => {
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
    });

    afterEach(async () => {
        if (newIdeation) {
            await prisma.projectIdeaVote.deleteMany({
                where: {
                    projectIdeaId: newIdeation.id,
                },
            });
            await prisma.projectIdea.delete({
                where: {
                    id: newIdeation.id,
                },
            });
        }
    });

    it("/POST teams/:teamId/ideations", async () => {
        await prisma.projectIdea.delete({
            where: {
                id: newIdeation.id,
            },
        });

        const teamId: number = newVoyageTeam.id;
        const createIdeationDto: CreateIdeationDto = {
            userId: newUser.id,
            title: "Ideation 1",
            description: "Ideation 1 description",
            vision: "Ideation 1 vision",
        };

        return request(app.getHttpServer())
            .post(`/teams/${teamId}/ideations`)
            .send(createIdeationDto)
            .expect(201)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual({
                    ...ideationShape,
                    updatedAt: expect.any(String),
                    voyageTeamMemberId: expect.any(Number),
                });
                // Clean up the new ideation
                newIdeation.id = res.body.id;
            });
    });

    it("/POST teams/:teamId/ideations/:ideationId/ideation-votes", async () => {
        await prisma.projectIdeaVote.delete({
            where: {
                id: newIdeationVote.id,
            },
        });

        const teamId: number = newVoyageTeam.id;
        const ideationId: number = newIdeation.id;
        const createIdeationVoteDto: CreateIdeationVoteDto = {
            userId: newUser.id,
        };

        return request(app.getHttpServer())
            .post(`/teams/${teamId}/ideations/${ideationId}/ideation-votes`)
            .send(createIdeationVoteDto)
            .expect(201)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual(ideationVoteShape);
            });
    });

    it("/GET teams/:teamId/ideations", async () => {
        const teamId: number = newVoyageTeam.id;
        const ideationCount: number = await prisma.projectIdea.count({
            where: {
                contributedBy: {
                    voyageTeamId: teamId,
                },
            },
        });

        return request(app.getHttpServer())
            .get(`/teams/${teamId}/ideations`)
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

    it("/PATCH ideations/:ideationId", async () => {
        const ideationId: number = newIdeation.id;
        const updateIdeationDto: UpdateIdeationDto = {
            userId: newUser.id,
            title: "Ideation 2",
            description: "Ideation 2 description",
            vision: "Ideation 2 vision",
        };

        return request(app.getHttpServer())
            .patch(`/ideations/${ideationId}`)
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

    it("/DELETE ideations/:ideationId", async () => {
        const ideationId: number = newIdeation.id;
        const deleteIdeationDto: DeleteIdeationDto = {
            userId: newUser.id,
        };

        return (
            request(app.getHttpServer())
                .delete(`/ideations/${ideationId}`)
                .send(deleteIdeationDto)
                .expect((res) => {
                    expect(res.body).toEqual({
                        ...ideationShape,
                        voyageTeamMemberId: expect.any(Number),
                        updatedAt: expect.any(String),
                    });
                })
                // Prevents Not Found error for afterEach
                .then(() => {
                    newIdeation = null;
                })
        );
    });

    it("/DELETE teams/:teamId/ideations/:ideationId/ideation-votes", async () => {
        const teamId: number = newVoyageTeam.id;
        const ideationId: number = newIdeation.id;
        const deleteIdeationVoteDto: DeleteIdeationVoteDto = {
            userId: newUser.id,
        };

        return request(app.getHttpServer())
            .delete(`/teams/${teamId}/ideations/${ideationId}/ideation-votes`)
            .send(deleteIdeationVoteDto)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual(ideationVoteShape);
            });
    });
});
