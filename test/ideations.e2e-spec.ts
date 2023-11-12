import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { ProjectIdea, ProjectIdeaVote } from "@prisma/client";
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

    // Existing user in the dev database
    const userId: string = "28bf426b-aa9f-451e-a4c7-77588bb640b1";

    const newUser = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@user.io",
        password: "changeme",
    };

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
        await prisma.$disconnect();
        await app.close();
    });

    let newIdeation: ProjectIdea;
    let newIdeationVote: ProjectIdeaVote;
    beforeEach(async () => {
        newIdeation = await prisma.projectIdea.create({
            data: {
                title: "Ideation 1",
                description: "Ideation 1 description",
                vision: "Ideation 1 vision",
                contributedBy: {
                    connect: {
                        id: 1,
                        userId: userId,
                    },
                },
            },
        });
        newIdeationVote = await prisma.projectIdeaVote.create({
            data: {
                votedBy: {
                    connect: {
                        id: 1,
                        userId: userId,
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

        const teamId: number = 1;
        const createIdeationDto: CreateIdeationDto = {
            userId: userId,
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

        const teamId: number = 1;
        const ideationId: number = newIdeation.id;
        const createIdeationVoteDto: CreateIdeationVoteDto = {
            userId: userId,
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
        const teamId: number = 1;
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
            userId: userId,
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
            userId: userId,
        };

        return request(app.getHttpServer())
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
            });
    });

    it("/DELETE teams/:teamId/ideations/:ideationId/ideation-votes", async () => {
        const teamId: number = 1;
        const ideationId: number = newIdeation.id;
        const deleteIdeationVoteDto: DeleteIdeationVoteDto = {
            userId: userId,
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
