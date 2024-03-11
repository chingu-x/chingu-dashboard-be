import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { seed } from "../prisma/seed/seed";
import { extractResCookieValueByKey } from "./utils";
import { CreateAgendaDto } from "src/sprints/dto/create-agenda.dto";
import { toBeOneOf } from "jest-extended";
expect.extend({ toBeOneOf });

describe("Sprints Controller (e2e)", () => {
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

    describe("GET /voyages/sprints - Gets all voyage and sprints data", () => {
        it("should successfully return all voyage and sprints data - 200", async () => {
            return request(app.getHttpServer())
                .get(`/voyages/sprints`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            //main response body array
                            expect.objectContaining({
                                id: expect.any(Number),
                                number: expect.any(String),
                                soloProjectDeadline: expect.any(String),
                                certificateIssueDate: expect.any(String),
                                showcasePublishDate: expect.toBeOneOf([
                                    null,
                                    expect.any(String),
                                ]),
                                startDate: expect.any(String),
                                endDate: expect.any(String),
                                sprints: expect.any(Array),
                            }),
                        ]),
                    );
                })
                .expect((res) => {
                    expect(res.body[0].sprints).toEqual(
                        expect.arrayContaining([
                            //sprints array
                            expect.objectContaining({
                                id: expect.any(Number),
                                number: expect.any(Number),
                                startDate: expect.any(String),
                                endDate: expect.any(String),
                            }),
                        ]),
                    );
                });
        });

        it("should return 401 if authorized token isn't present", async () => {
            return request(app.getHttpServer())
                .get(`/voyages/sprints`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401);
        });
    });

    describe("GET /voyages/sprints/teams/:teamId", () => {
        it("should return all the sprint dates of a particular team - 200", async () => {
            const teamId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/teams/${teamId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                            voyage: expect.objectContaining({
                                id: expect.any(Number),
                                number: expect.any(String),
                                sprints: expect.arrayContaining([
                                    expect.objectContaining({
                                        id: expect.any(Number),
                                        number: expect.any(Number),
                                        startDate: expect.any(String),
                                        endDate: expect.any(String),
                                    }),
                                ]),
                            }),
                        }),
                    );
                });
        });

        it("should return 404 if teamId is invalid", async () => {
            const teamId = 9999;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/teams/${teamId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(404);
        });

        it("should return 401 if authorization token is not present", async () => {
            const teamId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/teams/${teamId}`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401);
        });
    });

    describe("GET /voyages/sprints/meetings/:meetingId", () => {
        it("should return meeting details - 200", async () => {
            const meetingId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            sprint: expect.objectContaining({
                                id: expect.any(Number),
                                number: expect.any(Number),
                                startDate: expect.any(String),
                                endDate: expect.any(String),
                            }),
                            title: expect.any(String),
                            dateTime: expect.any(String),
                            meetingLink: expect.any(String),
                            notes: expect.any(String),
                            agendas: expect.any(Array),
                            formResponseMeeting: expect.any(Array),
                        }),
                    );
                })
                .expect((res) => {
                    //agendas array
                    expect(res.body.agendas).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                id: expect.any(Number),
                                title: expect.any(String),
                                description: expect.any(String),
                                status: expect.any(Boolean),
                            }),
                        ]),
                    );
                })
                .expect((res) => {
                    //form response meeting array
                    expect(res.body.formResponseMeeting).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                id: expect.any(Number),
                                form: expect.objectContaining({
                                    id: expect.any(Number),
                                    title: expect.any(String),
                                }),
                                responseGroup: expect.objectContaining({
                                    responses: expect.arrayContaining([
                                        expect.objectContaining({
                                            text: expect.any(String),
                                            numeric: expect.toBeOneOf([
                                                null,
                                                expect.any(Number),
                                            ]),
                                            boolean: expect.toBeOneOf([
                                                null,
                                                expect.any(Boolean),
                                            ]),
                                            optionChoice: expect.toBeOneOf([
                                                null,
                                                expect.any(Number),
                                            ]),
                                            question: expect.objectContaining({
                                                id: expect.any(Number),
                                                text: expect.any(String),
                                                description: expect.any(String),
                                                answerRequired:
                                                    expect.any(Boolean),
                                            }),
                                        }),
                                    ]),
                                }),
                            }),
                        ]),
                    );
                });
        });

        it("should return 404 if meetingId is invalid", async () => {
            const meetingId = 9999;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(404);
        });

        it("should return 401 if authorization token is not present", async () => {
            const meetingId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(401);
        });
    });

    describe("PATCH /voyages/sprints/meetings/:meetingId", () => {
        it("should update and return meeting details- 200", async () => {
            const meetingId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    title: "Test title",
                    dateTime: "2024-02-29T17:17:50.100Z",
                    meetingLink: "samplelink.com/meeting1234",
                    notes: "Test notes",
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            sprintId: expect.any(Number),
                            voyageTeamId: expect.any(Number),
                            title: expect.any(String),
                            dateTime: expect.any(String),
                            meetingLink: expect.any(String),
                            notes: expect.any(String),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        }),
                    );
                });
        });

        it("    verify meeting details updated in database", async () => {
            const meeting = await prisma.teamMeeting.findFirst({
                where: {
                    title: "Test title",
                    notes: "Test notes",
                },
            });
            return expect(meeting.title).toEqual("Test title");
        });
    });

    describe("POST /voyages/sprints/:sprintNumber/teams/:teamId/meetings", () => {
        it("201 - Created sprint meeting, returned details", async () => {
            const teamId = 1;
            const sprintNumber = 4;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    title: "Sprint Planning",
                    dateTime: "2024-03-01T23:11:20.271Z",
                    meetingLink: "samplelink.com/meeting1234",
                    notes: "Notes for the meeting",
                })
                .expect(201)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            sprintId: 4,
                            voyageTeamId: 1,
                            title: expect.any(String),
                            dateTime: expect.any(String),
                            meetingLink: expect.any(String),
                            notes: expect.any(String),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        }),
                    );
                });
        });

        it("    verify sprint meeting in database", async () => {
            const meeting = await prisma.teamMeeting.findMany({
                where: {
                    title: "Sprint Planning",
                    notes: "Notes for the meeting",
                },
            });
            return expect(meeting[0].title).toEqual("Sprint Planning");
        });

        it("409 - Tried to create meeting, one already exists for this sprint", async () => {
            const teamId = 1;
            const sprintNumber = 4;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    title: "Sprint Planning",
                    dateTime: "2024-03-01T23:11:20.271Z",
                    meetingLink: "samplelink.com/meeting1234",
                    notes: "Notes for the meeting",
                })
                .expect(409);
        });

        it("404 - Resource (team Id) not found", async () => {
            const teamId = 5;
            const sprintNumber = 5;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    title: "Sprint Planning",
                    dateTime: "2024-03-01T23:11:20.271Z",
                    meetingLink: "samplelink.com/meeting1234",
                    notes: "Notes for the meeting",
                })
                .expect(404);
        });

        it("400 - Bad request", async () => {
            const teamId = 1;
            const sprintNumber = 5;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    title: 1, //bad request - title should be string
                    dateTime: "2024-03-01T23:11:20.271Z",
                    meetingLink: "samplelink.com/meeting1234",
                    notes: "Notes for the meeting",
                })
                .expect(400);
        });
    });

    describe("POST /voyages/sprints/meetings/:meetingId/agendas", () => {
        it(" 201 - New agenda added", async () => {
            const meetingId = 1;
            const createAgendaDto: CreateAgendaDto = {
                title: "Test agenda 3",
                description: "See if it works...",
                status: false,
            };
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/agendas`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send(createAgendaDto)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            teamMeetingId: expect.any(Number),
                            title: "Test agenda 3",
                            description: "See if it works...",
                            status: expect.any(Boolean),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        }),
                    );
                });
        });

        it("    verify new agenda in database", async () => {
            const agenda = await prisma.agenda.findMany({
                where: {
                    title: "Test agenda 3",
                    description: "See if it works...",
                },
            });
            return expect(agenda[0].title).toEqual("Test agenda 3");
        });

        it("400 - Bad Request - Invalid Meeting Id", async () => {
            const meetingId = " ";
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/agendas`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    title: "Contribute to the agenda!",
                    description:
                        "To get started, click the Add Topic button...",
                })
                .expect(400);
        });
    });

    describe("PATCH /voyages/sprints/agendas/:agendaId", () => {
        it("200 - Agenda updated successfully", async () => {
            const agendaId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/agendas/${agendaId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    title: "Title updated",
                    description: "New agenda",
                    status: true,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: 1,
                            teamMeetingId: 1,
                            title: "Title updated",
                            description: "New agenda",
                            status: true,
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        }),
                    );
                });
        });

        it("    verify patch in database", async () => {
            const agenda = await prisma.agenda.findMany({
                where: {
                    title: "Title updated",
                    description: "New agenda",
                },
            });
            return expect(agenda[0].title).toEqual("Title updated");
        });

        it("404 - Invalid Agenda Id", async () => {
            const agendaId = 9999;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/agendas/${agendaId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    title: "Title updated",
                    description: "New agenda",
                    status: true,
                })
                .expect(404);
        });
    });
    describe("DELETE /voyages/sprints/agendas/:agendaId", () => {
        it("200 - Agenda deleted successfully", async () => {
            const agendaId = 1;
            return request(app.getHttpServer())
                .delete(`/voyages/sprints/agendas/${agendaId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: 1,
                            title: expect.any(String),
                            description: expect.any(String),
                            status: expect.any(Boolean),
                            teamMeetingId: expect.any(Number),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        }),
                    );
                });
        });

        it("    verify agenda deleted from database", async () => {
            const agenda = await prisma.agenda.findUnique({
                where: {
                    id: 1,
                },
            });
            return expect(agenda).toEqual(null);
        });

        it("404 - Invalid Agenda Id", async () => {
            const agendaId = 9999;
            return request(app.getHttpServer())
                .delete(`/voyages/sprints/agendas/${agendaId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(404);
        });
    });

    describe("POST /voyages/sprints/meetings/:meetingId/forms/:formId", () => {
        it("200 - Meeting form created successfully", async () => {
            const meetingId = 2;
            const formId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            formId: 1,
                            meetingId: 2,
                            responseGroupId: expect.any(Number),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        }),
                    );
                });
        });

        it("    verify meeting form in database", async () => {
            const responseMeeting = await prisma.formResponseMeeting.findMany({
                where: {
                    formId: 1,
                    meetingId: 2,
                },
            });
            return expect(responseMeeting[0].formId).toEqual(1);
        });

        it("409 - Form already exists for this meeting", async () => {
            const meetingId = 2;
            const formId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(409);
        });

        it("400 - Invalid form or meeting", async () => {
            const meetingId = 9999;
            const formId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(400);
        });
    });
    describe("GET /voyages/sprints/meetings/:meetingId/forms/:formId", () => {
        it("200 - Successfully get the meeting form with responses", async () => {
            const meetingId = 2;
            const formId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            formType: expect.objectContaining({
                                id: expect.any(Number),
                                name: expect.any(String),
                            }),
                            title: expect.any(String),
                            description: null,
                            questions: expect.arrayContaining([
                                expect.objectContaining({
                                    id: expect.any(Number),
                                    order: expect.any(Number),
                                    inputType: {
                                        id: expect.any(Number),
                                        name: expect.any(String),
                                    },
                                    text: expect.any(String),
                                    description: expect.any(String),
                                    answerRequired: expect.any(Boolean),
                                    multipleAllowed: null,
                                    optionGroup: null,
                                    responses: expect.any(Array),
                                }),
                            ]),
                        }),
                    );
                });
        });

        it("should return 404 if meeting id is invalid", async () => {
            const meetingId = 9999;
            const formId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(404);
        });

        it("should return 400 if meeting id is correct but form id is invalid", async () => {
            const meetingId = 2;
            const formId = 9999;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(400);
        });
    });
    describe("PATCH /voyages/sprints/meetings/:meetingId/forms/:formId", () => {
        it("200 - Successfully update the meeting form with responses", async () => {
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    response: {
                        questionId: 1,
                        optionChoiceId: 1,
                        text: "Team member x landed a job this week.",
                        boolean: true,
                        number: 1,
                    },
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                id: expect.any(Number),
                                questionId: expect.any(Number),
                                optionChoiceId: expect.any(Number),
                                numeric: expect.toBeOneOf([
                                    null,
                                    expect.any(Number),
                                ]),
                                boolean: expect.any(Boolean),
                                text: expect.any(String),
                                responseGroupId: expect.any(Number),
                                createdAt: expect.any(String),
                                updatedAt: expect.any(String),
                            }),
                        ]),
                    );
                });
        });

        it("    verify meeting response in database", async () => {
            const response = await prisma.response.findMany({
                where: {
                    questionId: 1,
                    optionChoiceId: 1,
                    text: "Team member x landed a job this week.",
                    boolean: true,
                },
            });
            return expect(response[0].questionId).toEqual(1);
        });

        it("should return 400 if form id is a string", async () => {
            const meetingId = 2;
            const formId = "Bad request";
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .send({
                    response: {
                        questionId: 1,
                        optionChoiceId: 1,
                        text: "Team member x landed a job this week.",
                        boolean: true,
                        number: 1,
                    },
                })
                .expect(400);
        });
    });
});