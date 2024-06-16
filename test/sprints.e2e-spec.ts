import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { seed } from "../prisma/seed/seed";
import { loginAndGetTokens } from "./utils";
import { CreateAgendaDto } from "src/sprints/dto/create-agenda.dto";
import { toBeOneOf } from "jest-extended";
import * as cookieParser from "cookie-parser";
import { FormTitles } from "../src/global/constants/formTitles";

expect.extend({ toBeOneOf });

describe("Sprints Controller (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let accessToken: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        await seed();
        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        app.useGlobalPipes(new ValidationPipe());
        app.use(cookieParser());
        await app.init();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    beforeEach(async () => {
        await loginAndGetTokens(
            "jessica.williamson@gmail.com",
            "password",
            app,
        ).then((tokens) => {
            accessToken = tokens.access_token;
        });
    });

    describe("GET /voyages/sprints - gets all voyage and sprints data", () => {
        it("should return 200 if fetching all voyage and sprints data", async () => {
            return request(app.getHttpServer())
                .get(`/voyages/sprints`)
                .set("Cookie", accessToken)
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

    describe("GET /voyages/sprints/teams/:teamId - gets a team's sprint dates", () => {
        it("should return 200 if fetching all the sprint dates of a particular team was successful", async () => {
            const teamId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/teams/${teamId}`)
                .set("Cookie", accessToken)
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
                .set("Cookie", accessToken)
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

    describe("GET /voyages/sprints/meetings/:meetingId - gets details for one meeting", () => {
        it("should return 200 if fetching meeting details was successful", async () => {
            const meetingId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}`)
                .set("Cookie", accessToken)
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
                .set("Cookie", accessToken)
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

    describe("PATCH /voyages/sprints/meetings/:meetingId - updates details for a meeting", () => {
        it("should return 200 if meeting details was successfully updated", async () => {
            const meetingId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}`)
                .set("Cookie", accessToken)
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

        it("- verify updated meeting details found in database", async () => {
            const meeting = await prisma.teamMeeting.findFirst({
                where: {
                    title: "Test title",
                    notes: "Test notes",
                },
            });
            return expect(meeting.title).toEqual("Test title");
        });
    });

    describe("POST /voyages/sprints/:sprintNumber/teams/:teamId/meetings - creates new meeting for a sprint", () => {
        it("should return 201 if creating sprint meeting details was successful", async () => {
            const teamId = 1;
            const sprintNumber = 4;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Cookie", accessToken)
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
        it("- verify new sprint meeting found in database", async () => {
            const meeting = await prisma.teamMeeting.findFirst({
                where: {
                    title: "Sprint Planning",
                    notes: "Notes for the meeting",
                },
            });
            return expect(meeting.title).toEqual("Sprint Planning");
        });

        it("should return 409 if trying to create a meeting that already exists for sprint", async () => {
            const teamId = 1;
            const sprintNumber = 4;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Cookie", accessToken)
                .send({
                    title: "Sprint Planning",
                    dateTime: "2024-03-01T23:11:20.271Z",
                    meetingLink: "samplelink.com/meeting1234",
                    notes: "Notes for the meeting",
                })
                .expect(409);
        });

        it("should return 404 if teamId not found", async () => {
            const teamId = 5;
            const sprintNumber = 5;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Cookie", accessToken)
                .send({
                    title: "Sprint Planning",
                    dateTime: "2024-03-01T23:11:20.271Z",
                    meetingLink: "samplelink.com/meeting1234",
                    notes: "Notes for the meeting",
                })
                .expect(404);
        });

        it("should return 400 for bad request (title is Number)", async () => {
            const teamId = 1;
            const sprintNumber = 5;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Cookie", accessToken)
                .send({
                    title: 1, //bad request - title should be string
                    dateTime: "2024-03-01T23:11:20.271Z",
                    meetingLink: "samplelink.com/meeting1234",
                    notes: "Notes for the meeting",
                })
                .expect(400);
        });
    });

    describe("POST /voyages/sprints/meetings/:meetingId/agendas - creates a new meeting agenda", () => {
        it("should return 201 if create new agenda was successful", async () => {
            const meetingId = 1;
            const createAgendaDto: CreateAgendaDto = {
                title: "Test agenda 3",
                description: "See if it works...",
                status: false,
            };
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/agendas`)
                .set("Cookie", accessToken)
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

        it("- verify new agenda found in database", async () => {
            const agenda = await prisma.agenda.findFirst({
                where: {
                    title: "Test agenda 3",
                    description: "See if it works...",
                },
            });
            return expect(agenda.title).toEqual("Test agenda 3");
        });

        it("should return 400 if meetingId is String", async () => {
            const meetingId = " ";
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/agendas`)
                .set("Cookie", accessToken)
                .send({
                    title: "Contribute to the agenda!",
                    description:
                        "To get started, click the Add Topic button...",
                })
                .expect(400);
        });
    });

    describe("PATCH /voyages/sprints/agendas/:agendaId - supdate an agenda", () => {
        it("should return 200 if updating the agenda was successful with provided values", async () => {
            const agendaId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/agendas/${agendaId}`)
                .set("Cookie", accessToken)
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

        it("- verify updated agenda found in database", async () => {
            const agenda = await prisma.agenda.findFirst({
                where: {
                    title: "Title updated",
                    description: "New agenda",
                },
            });
            return expect(agenda.title).toEqual("Title updated");
        });

        it("should return 404 if agendaId is not found", async () => {
            const agendaId = 9999;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/agendas/${agendaId}`)
                .set("Cookie", accessToken)
                .send({
                    title: "Title updated",
                    description: "New agenda",
                    status: true,
                })
                .expect(404);
        });
    });
    describe("DELETE /voyages/sprints/agendas/:agendaId - deletes specified agenda", () => {
        it("should return 200 and delete agenda from database", async () => {
            const agendaId = 1;
            return request(app.getHttpServer())
                .delete(`/voyages/sprints/agendas/${agendaId}`)
                .set("Cookie", accessToken)
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
        it("- verify agenda id: 1 not found in database", async () => {
            const agenda = await prisma.agenda.findUnique({
                where: {
                    id: 1,
                },
            });
            return expect(agenda).toEqual(null);
        });

        it("should return 404 if agendaId is not found", async () => {
            const agendaId = 9999;
            return request(app.getHttpServer())
                .delete(`/voyages/sprints/agendas/${agendaId}`)
                .set("Cookie", accessToken)
                .expect(404);
        });
    });

    describe("POST /voyages/sprints/meetings/:meetingId/forms/:formId - creates new meeting form", () => {
        it("should return 200 and create new meeting form", async () => {
            const meetingId = 2;
            const formId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", accessToken)
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

        it("- verify meeting form found in database", async () => {
            const responseMeeting = await prisma.formResponseMeeting.findFirst({
                where: {
                    formId: 1,
                    meetingId: 2,
                },
            });
            return expect(responseMeeting.formId).toEqual(1);
        });

        it("should return 409 if form already exists for this meeting", async () => {
            const meetingId = 2;
            const formId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", accessToken)
                .expect(409);
        });

        it("should return 400 if meetingId is not found", async () => {
            const meetingId = 9999;
            const formId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", accessToken)
                .expect(400);
        });

        it("should return 400 if formId is not found", async () => {
            const meetingId = 1;
            const formId = 999;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", accessToken)
                .expect(400);
        });
    });
    describe("GET /voyages/sprints/meetings/:meetingId/forms/:formId - gets meeting form", () => {
        it("should return 200 if the meeting form was successfully fetched #with responses", async () => {
            const meetingId = 2;
            const formId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", accessToken)
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

        it("should return 404 if meetingId is not found", async () => {
            const meetingId = 9999;
            const formId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", accessToken)
                .expect(404);
        });

        it("should return 400 if formId is is not found", async () => {
            const meetingId = 2;
            const formId = 9999;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", accessToken)
                .expect(400);
        });
    });
    describe("PATCH /voyages/sprints/meetings/:meetingId/forms/:formId - updates a meeting form", () => {
        it("should return 200 if successfully create a meeting form response", async () => {
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", accessToken)
                .send({
                    responses: [
                        {
                            questionId: 1,
                            text: "Team member x landed a job this week.",
                        },
                    ],
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                id: expect.any(Number),
                                questionId: expect.any(Number),
                                text: expect.any(String),
                                responseGroupId: expect.any(Number),
                                createdAt: expect.any(String),
                                updatedAt: expect.any(String),
                            }),
                        ]),
                    );
                });
        });
        it("- verify meeting response found in database (create)", async () => {
            const response = await prisma.response.findMany({
                where: {
                    questionId: 1,
                    text: "Team member x landed a job this week.",
                },
            });
            expect(response.length).toBe(1);
            return expect(response[0].questionId).toEqual(1);
        });
        it("should return 200 if successfully update a meeting form response", async () => {
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", accessToken)
                .send({
                    responses: [
                        {
                            questionId: 1,
                            text: "Update - Team member x landed a job this week.",
                        },
                    ],
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                id: expect.any(Number),
                                questionId: expect.any(Number),
                                text: expect.any(String),
                                responseGroupId: expect.any(Number),
                                createdAt: expect.any(String),
                                updatedAt: expect.any(String),
                            }),
                        ]),
                    );
                });
        });
        it("- verify meeting response is updated database", async () => {
            const response = await prisma.response.findMany({
                where: {
                    questionId: 1,
                    text: "Update - Team member x landed a job this week.",
                },
            });
            expect(response.length).toBe(1);
            return expect(response[0].questionId).toEqual(1);
        });

        it("should return 400 if formId is a string", async () => {
            const meetingId = 2;
            const formId = "Bad request";
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", accessToken)
                .send({
                    responses: [
                        {
                            questionId: 1,
                            optionChoiceId: 1,
                            text: "Team member x landed a job this week.",
                            boolean: true,
                            number: 1,
                        },
                    ],
                })
                .expect(400);
        });

        it("should return 400 if responses in the body is not an array", async () => {
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", accessToken)
                .send({
                    responses: {
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

    describe("POST /voyages/sprints/check-in - submit sprint check in form", () => {
        const sprintCheckinUrl = "/voyages/sprints/check-in";
        let checkinForm: any;
        let questions: any;

        beforeEach(async () => {
            checkinForm = await prisma.form.findUnique({
                where: {
                    title: FormTitles.sprintCheckin,
                },
            });
            questions = await prisma.question.findMany({
                where: {
                    formId: checkinForm.id,
                },
                select: {
                    id: true,
                },
            });
        });

        it("should return 201 if successfully submitted a check in form", async () => {
            const responsesBefore = await prisma.response.count();
            const responseGroupBefore = await prisma.responseGroup.count();
            const checkinsBefore = await prisma.formResponseCheckin.count();

            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamMemberId: 2, // voyageTeamMemberId 1 is already in the seed
                    sprintId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: "Text input value",
                        },
                        {
                            questionId: questions[1].id,
                            boolean: true,
                        },
                        {
                            questionId: questions[2].id,
                            numeric: 12,
                        },
                        {
                            questionId: questions[3].id,
                            optionChoiceId: 1,
                        },
                    ],
                })
                .expect(201);

            const responsesAfter = await prisma.response.count();
            const responseGroupAfter = await prisma.responseGroup.count();
            const checkinsAfter = await prisma.formResponseCheckin.count();

            expect(responsesAfter).toEqual(responsesBefore + 4);
            expect(responseGroupAfter).toEqual(responseGroupBefore + 1);
            expect(checkinsAfter).toEqual(checkinsBefore + 1);
        });
        it("should return 400 for invalid inputs", async () => {
            const responsesBefore = await prisma.response.count();
            const responseGroupBefore = await prisma.responseGroup.count();
            const checkinsBefore = await prisma.formResponseCheckin.count();
            // missing voyageTeamMemberId
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", accessToken)
                .send({
                    sprintId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: "Text input value",
                        },
                    ],
                })
                .expect(400);

            // missing sprintId"
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamMemberId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: "Text input value",
                        },
                    ],
                })
                .expect(400);

            // missing responses
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamMemberId: 1,
                    sprintId: 1,
                })
                .expect(400);

            // missing questionId in responses - response validation pipe
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamMemberId: 1,
                    responses: [
                        {
                            text: "Text input value",
                        },
                    ],
                })
                .expect(400);

            // missing input in responses - response validation pipe
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamMemberId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                        },
                    ],
                })
                .expect(400);

            // wrong response input types
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamMemberId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                            numeric: "not a number",
                        },
                    ],
                })
                .expect(400);

            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamMemberId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                            responseGroupId: "not an id",
                        },
                    ],
                })
                .expect(400);

            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamMemberId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                            optionGroupId: "not an id",
                        },
                    ],
                })
                .expect(400);

            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamMemberId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                            boolean: "not a boolean",
                        },
                    ],
                })
                .expect(400);

            const responsesAfter = await prisma.response.count();
            const responseGroupAfter = await prisma.responseGroup.count();
            const checkinsAfter = await prisma.formResponseCheckin.count();

            expect(responsesAfter).toEqual(responsesBefore);
            expect(responseGroupAfter).toEqual(responseGroupBefore);
            expect(checkinsAfter).toEqual(checkinsBefore);
        });

        it("should return 401 if user is not logged in", async () => {
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .send({
                    voyageTeamMemberId: 1,
                    sprintId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: "Text input value",
                        },
                    ],
                })
                .expect(401);
        });

        it("should return 409 if user has already submitted the check in form for the same sprint", async () => {
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamMemberId: 1,
                    sprintId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: "Text input value",
                        },
                    ],
                });
            const responsesBefore = await prisma.response.count();
            const responseGroupBefore = await prisma.responseGroup.count();
            const checkinsBefore = await prisma.formResponseCheckin.count();

            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamMemberId: 1,
                    sprintId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: "Text input value",
                        },
                    ],
                })
                .expect(409);

            const responsesAfter = await prisma.response.count();
            const responseGroupAfter = await prisma.responseGroup.count();
            const checkinsAfter = await prisma.formResponseCheckin.count();

            expect(responsesAfter).toEqual(responsesBefore);
            expect(responseGroupAfter).toEqual(responseGroupBefore);
            expect(checkinsAfter).toEqual(checkinsBefore);
        });
    });

    describe("GET /voyages/sprints/check-in - returns sprint check in form", () => {
        const sprintCheckinUrl = "/voyages/sprints/check-in";

        beforeEach(async () => {
            await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            ).then((tokens) => {
                accessToken = tokens.access_token;
            });
        });

        it("should return 200 if voyageNumber key's value successfully returns a check in form", async () => {
            const key = "voyageNumber";
            const val = "46";
            return request(app.getHttpServer())
                .get(sprintCheckinUrl)
                .query({ [key]: val })
                .set("Cookie", accessToken)
                .expect(200)
                .expect("Content-Type", /json/);
        });
    });
});
