import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { seed } from "@Prisma/seed/seed";
import { loginAndGetTokens } from "./utils";
import { CreateAgendaDto } from "@/sprints/dto/create-agenda.dto";
import { toBeOneOf } from "jest-extended";
import * as cookieParser from "cookie-parser";
import { FormTitles } from "@/global/constants/formTitles";
import { CASLForbiddenExceptionFilter } from "@/exception-filters/casl-forbidden-exception.filter";

expect.extend({ toBeOneOf });

describe("Sprints Controller (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        await seed();
        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        app.useGlobalFilters(new CASLForbiddenExceptionFilter());
        app.use(cookieParser());
        await app.init();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    describe("GET /voyages/sprints - gets all voyage and sprints data", () => {
        it("should return 200 if fetching all voyage and sprints data", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            return request(app.getHttpServer())
                .get(`/voyages/sprints`)
                .set("Cookie", [access_token, refresh_token])
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

        it("should return 401 if user is not logged in", async () => {
            return request(app.getHttpServer())
                .get(`/voyages/sprints`)
                .set("Authorization", `${undefined}`)
                .expect(401);
        });
        it("should return 403 if a non-admin user tries to access it", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "leo.rowe@outlook.com",
                "password",
                app,
            );
            return request(app.getHttpServer())
                .get(`/voyages/sprints`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 403 if a non-voyager tries to access it", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );
            return request(app.getHttpServer())
                .get(`/voyages/sprints`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });

    describe("GET /voyages/sprints/teams/:teamId - gets a team's sprint dates", () => {
        it("should return 200 if fetching all the sprint dates of a particular team was successful", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const teamId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/teams/${teamId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
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
                            sprints: expect.arrayContaining([
                                expect.objectContaining({
                                    id: expect.any(Number),
                                    number: expect.any(Number),
                                    startDate: expect.any(String),
                                    endDate: expect.any(String),
                                }),
                            ]),
                        }),
                    );
                });
        });

        it("should return 404 if teamId is invalid", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const teamId = 9999;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/teams/${teamId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });

        it("should return 401 if user is not logged in", async () => {
            const teamId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/teams/${teamId}`)
                .set("Authorization", `${undefined}`)
                .expect(401);
        });
        it("should return 403 if a user of other team tries to access", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const teamId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/teams/${teamId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 403 if a non-voyager tries to access it", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );
            const teamId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/teams/${teamId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });

    describe("GET /voyages/sprints/meetings/:meetingId - gets details for one meeting", () => {
        it("should return 200 if fetching meeting details was successful", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}`)
                .set("Cookie", [access_token, refresh_token])
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
                            description: expect.any(String),
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
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 9999;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });

        it("should return 401 if user is not logged in", async () => {
            const meetingId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}`)
                .set("Authorization", `${undefined}`)
                .expect(401);
        });
        it("should return 403 if a non-voyager tries to access it", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );
            const meetingId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 403 if a user of other team tries to access the meeting", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const meetingId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });

    describe("PATCH /voyages/sprints/meetings/:meetingId - updates details for a meeting", () => {
        it("should return 200 if meeting details was successfully updated", async () => {
            const meetingId = 1;
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}`)
                .set("Cookie", [access_token, refresh_token])
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
                            description: expect.any(String),
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
            return expect(meeting?.title).toEqual("Test title");
        });

        it("should return 401 if user is not logged in", async () => {
            const meetingId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}`)
                .set("Authorization", `${undefined}`)
                .expect(401);
        });
        it("should return 403 if a non-voyager tries to access it", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );
            const meetingId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 403 if a user of other team tries to update the meeting", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const meetingId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });

        it("should return 404 if meetingId is invalid", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 9999;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });
    });

    describe("POST /voyages/sprints/:sprintNumber/teams/:teamId/meetings - creates new meeting for a sprint", () => {
        it("should return 201 if creating sprint meeting details was successful", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const teamId = 1;
            const sprintNumber = 4;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: FormTitles.sprintPlanning,
                    description: "This is a meeting description.",
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
                            description: expect.any(String),
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
                    title: FormTitles.sprintPlanning,
                    notes: "Notes for the meeting",
                },
            });
            return expect(meeting?.title).toEqual(FormTitles.sprintPlanning);
        });

        it("should return 409 if trying to create a meeting that already exists for sprint", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const teamId = 1;
            const sprintNumber = 4;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: FormTitles.sprintPlanning,
                    description: "This is a meeting description.",
                    dateTime: "2024-03-01T23:11:20.271Z",
                    meetingLink: "samplelink.com/meeting1234",
                    notes: "Notes for the meeting",
                })
                .expect(409);
        });

        it("should return 404 if teamId not found", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const teamId = 999;
            const sprintNumber = 5;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: FormTitles.sprintPlanning,
                    description: "This is a meeting description.",
                    dateTime: "2024-03-01T23:11:20.271Z",
                    meetingLink: "samplelink.com/meeting1234",
                    notes: "Notes for the meeting",
                })
                .expect(404);
        });

        it("should return 400 for bad request (title is Number)", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const teamId = 1;
            const sprintNumber = 5;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: 1, //bad request - title should be string
                    dateTime: "2024-03-01T23:11:20.271Z",
                    meetingLink: "samplelink.com/meeting1234",
                    notes: "Notes for the meeting",
                })
                .expect(400);
        });

        it("should return 401 if user is not logged in", async () => {
            const teamId = 1;
            const sprintNumber = 4;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Authorization", `${undefined}`)
                .expect(401);
        });

        it("should return 403 if a non-voyager tries to create a sprint meeting", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );
            const teamId = 1;
            const sprintNumber = 4;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 403 if a user of other team tries to  create the meetings", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const teamId = 1;
            const sprintNumber = 4;
            return request(app.getHttpServer())
                .post(
                    `/voyages/sprints/${sprintNumber}/teams/${teamId}/meetings`,
                )
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: FormTitles.sprintPlanning,
                    description: "This is a meeting description.",
                    dateTime: "2024-03-01T23:11:20.271Z",
                    meetingLink: "samplelink.com/meeting1234",
                    notes: "Notes for the meeting",
                })
                .expect(403);
        });
    });

    describe("POST /voyages/sprints/meetings/:meetingId/agendas - creates a new meeting agenda", () => {
        it("should return 201 if create new agenda was successful", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 1;
            const createAgendaDto: CreateAgendaDto = {
                title: "Test agenda 3",
                description: "See if it works...",
                status: false,
            };
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/agendas`)
                .set("Cookie", [access_token, refresh_token])
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
            return expect(agenda?.title).toEqual("Test agenda 3");
        });

        it("should return 400 if meetingId is String", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = "a";
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/agendas`)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: "Contribute to the agenda!",
                    description:
                        "To get started, click the Add Topic button...",
                })
                .expect(400);
        });
        it("should return 400 if description is missing", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/agendas`)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: "Contribute to the agenda!",
                })
                .expect(400);
        });
        it("should return 400 if title is missing", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/agendas`)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    description:
                        "To get started, click the Add Topic button...",
                })
                .expect(400);
        });

        it("should return 401 if user is not logged in", async () => {
            const meetingId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/agendas`)
                .set("Authorization", `${undefined}`)
                .expect(401);
        });

        it("should return 403 if a non-voyager tries to create an agenda", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );

            const meetingId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/agendas`)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: "Contribute to the agenda!",
                    description:
                        "To get started, click the Add Topic button...",
                })
                .expect(403);
        });

        it("should return 403 if a user of other team tries to create an agenda", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const meetingId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/agendas`)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: "Contribute to the agenda!",
                    description:
                        "To get started, click the Add Topic button...",
                })
                .expect(403);
        });
    });

    describe("PATCH /voyages/sprints/agendas/:agendaId - update an agenda", () => {
        it("should return 200 if updating the agenda was successful with provided values", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const agendaId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/agendas/${agendaId}`)
                .set("Cookie", [access_token, refresh_token])
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
            return expect(agenda?.title).toEqual("Title updated");
        });

        it("should return 404 if agendaId is not found", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const agendaId = 9999;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/agendas/${agendaId}`)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: "Title updated",
                    description: "New agenda",
                    status: true,
                })
                .expect(404);
        });

        it("should return 401 if user is not logged in", async () => {
            const agendaId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/agendas/${agendaId}`)
                .set("Authorization", `${undefined}`)
                .expect(401);
        });

        it("should return 403 if a non-voyager tries to update an agenda", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );
            const agendaId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/agendas/${agendaId}`)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: "Title updated",
                    description: "New agenda",
                    status: true,
                })
                .expect(403);
        });

        it("should return 403 if a user of other team tries to update the agenda", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const agendaId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/agendas/${agendaId}`)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: "Title updated",
                    description: "New agenda",
                    status: true,
                })
                .expect(403);
        });
    });
    describe("DELETE /voyages/sprints/agendas/:agendaId - deletes specified agenda", () => {
        it("should return 200 and delete agenda from database", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const agendaId = 1;
            return request(app.getHttpServer())
                .delete(`/voyages/sprints/agendas/${agendaId}`)
                .set("Cookie", [access_token, refresh_token])
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
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const agendaId = 9999;
            return request(app.getHttpServer())
                .delete(`/voyages/sprints/agendas/${agendaId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });

        it("should return 401 if user is not logged in", async () => {
            const agendaId = 1;
            return request(app.getHttpServer())
                .delete(`/voyages/sprints/agendas/${agendaId}`)
                .set("Authorization", `${undefined}`)
                .expect(401);
        });

        it("should return 403 if a non-voyager tries to delete an agenda", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );
            const agendaId = 1;
            return request(app.getHttpServer())
                .delete(`/voyages/sprints/agendas/${agendaId}`)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: "Title updated",
                    description: "New agenda",
                    status: true,
                })
                .expect(403);
        });

        it("should return 403 if a user of other team tries to delete the agenda", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const agendaId = 2;
            return request(app.getHttpServer())
                .delete(`/voyages/sprints/agendas/${agendaId}`)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    title: "Title updated",
                    description: "New agenda",
                    status: true,
                })
                .expect(403);
        });
    });

    describe("POST /voyages/sprints/meetings/:meetingId/forms/:formId - creates new meeting form", () => {
        it("should return 200 and create new meeting form", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 2;
            const formId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
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
            return expect(responseMeeting?.formId).toEqual(1);
        });

        it("should return 409 if form already exists for this meeting", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 2;
            const formId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(409);
        });

        it("should return 404 if meetingId is not found", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 9999;
            const formId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });

        it("should return 400 if formId is not found", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 1;
            const formId = 999;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(400);
        });

        it("should return 401 if user is not logged in", async () => {
            const meetingId = 1;
            const formId = 999;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Authorization", `${undefined}`)
                .expect(401);
        });

        it("should return 403 if a non-voyager tries to create a meeting form", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 403 if a user of other team tries to create a meeting form", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .post(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });
    describe("GET /voyages/sprints/meetings/:meetingId/forms/:formId - gets meeting form", () => {
        it("should return 200 if the meeting form was successfully fetched #with responses", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 2;
            const formId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
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
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 9999;
            const formId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });

        it("should return 400 if formId is is not found", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 2;
            const formId = 9999;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(400);
        });

        it("should return 401 if user is not logged in", async () => {
            const meetingId = 1;
            const formId = 999;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Authorization", `${undefined}`)
                .expect(401);
        });

        it("should return 403 if a non-voyager tries to create a meeting form", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
        it("should return 403 if a user of other team tries to create a meeting form", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .get(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });

    describe("PATCH /voyages/sprints/meetings/:meetingId/forms/:formId - updates a meeting form", () => {
        it("should return 200 if successfully create a meeting form response", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
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
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
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
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 2;
            const formId = "Bad request";
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
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

        it("should return 404 if meeting id not found", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 99999;
            const formId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
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
                .expect(404);
        });

        it("should return 400 if responses in the body is not an array", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
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

        it("should return 401 if user is not logged in", async () => {
            const meetingId = 1;
            const formId = 999;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Authorization", `${undefined}`)
                .expect(401);
        });

        it("should return 403 if a non-voyager tries to update a meeting form", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "not_in_voyage@example.com",
                "password",
                app,
            );
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    responses: [
                        {
                            questionId: 1,
                            text: "Team member x landed a job this week.",
                        },
                    ],
                })
                .expect(403);
        });

        it("should return 403 if a user of other team tries to update a meeting form", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "JosoMadar@dayrep.com",
                "password",
                app,
            );
            const meetingId = 1;
            const formId = 1;
            return request(app.getHttpServer())
                .patch(`/voyages/sprints/meetings/${meetingId}/forms/${formId}`)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    responses: [
                        {
                            questionId: 1,
                            text: "Team member x landed a job this week.",
                        },
                    ],
                })
                .expect(403);
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
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const responsesBefore = await prisma.response.count();
            const responseGroupBefore = await prisma.responseGroup.count();
            const checkinsBefore = await prisma.formResponseCheckin.count();

            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    voyageTeamMemberId: 4, // voyageTeamMemberId 1 is already in the seed
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
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const responsesBefore = await prisma.response.count();
            const responseGroupBefore = await prisma.responseGroup.count();
            const checkinsBefore = await prisma.formResponseCheckin.count();
            // missing voyageTeamMemberId
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", [access_token, refresh_token])
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
                .set("Cookie", [access_token, refresh_token])
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
                .set("Cookie", [access_token, refresh_token])
                .send({
                    voyageTeamMemberId: 1,
                    sprintId: 1,
                })
                .expect(400);

            // missing questionId in responses - response validation pipe
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", [access_token, refresh_token])
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
                .set("Cookie", [access_token, refresh_token])
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
                .set("Cookie", [access_token, refresh_token])
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
                .set("Cookie", [access_token, refresh_token])
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
                .set("Cookie", [access_token, refresh_token])
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
                .set("Cookie", [access_token, refresh_token])
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

            // sprint id is for a voyage the team member isn't part of
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", access_token)
                .send({
                    sprintId: 25,
                    voyageTeamMemberId: 4,
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: "Text input value",
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
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    voyageTeamMemberId: 4,
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
                .set("Cookie", [access_token, refresh_token])
                .send({
                    voyageTeamMemberId: 4,
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
        it("should return 400 if the user doesnot belong to the voyage team", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .post(sprintCheckinUrl)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    voyageTeamMemberId: 5,
                    sprintId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: "Text input value",
                        },
                    ],
                })
                .expect(400);
        });
    });

    describe("GET /voyages/sprints/check-in - returns sprint check in form", () => {
        const sprintCheckinUrl = "/voyages/sprints/check-in";
        const questionShape = {
            id: expect.any(Number),
            formId: expect.any(Number),
            order: expect.any(Number),
            inputTypeId: expect.any(Number),
            text: expect.any(String),
            description: expect.toBeOneOf([null, expect.any(String)]),
            answerRequired: expect.any(Boolean),
            multipleAllowed: expect.toBeOneOf([null, expect.any(Boolean)]),
            optionGroupId: expect.toBeOneOf([null, expect.any(Number)]),
            parentQuestionId: expect.toBeOneOf([null, expect.any(Number)]),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        };

        const optionChoiceShape = {
            id: expect.any(Number),
            optionGroupId: expect.any(Number),
            text: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        };

        const responseShape = {
            id: expect.any(Number),
            questionId: expect.any(Number),
            optionChoiceId: expect.toBeOneOf([null, expect.any(Number)]),
            numeric: expect.toBeOneOf([null, expect.any(Number)]),
            boolean: expect.toBeOneOf([null, expect.any(Boolean)]),
            text: expect.toBeOneOf([null, expect.any(String)]),
            responseGroupId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            question: expect.objectContaining(questionShape),
            optionChoice: expect.toBeOneOf([
                null,
                expect.objectContaining(optionChoiceShape),
            ]),
        };

        const responseGroupShape = {
            responses: expect.arrayContaining([
                expect.objectContaining(responseShape),
            ]),
        };

        const sprintWithVoyageNumberShape = {
            number: expect.any(Number),
            voyage: expect.objectContaining({
                number: expect.any(String),
            }),
        };

        const formResponseCheckinShape = {
            id: expect.any(Number),
            voyageTeamMemberId: expect.any(Number),
            sprintId: expect.any(Number),
            adminComments: expect.toBeOneOf([null, expect.any(String)]),
            feedbackSent: expect.any(Boolean),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            voyageTeamMember: expect.objectContaining({
                voyageTeamId: expect.any(Number),
            }),
            sprint: expect.objectContaining(sprintWithVoyageNumberShape),
            responseGroup: expect.objectContaining(responseGroupShape),
        };

        it("should return 200 if voyageNumber key's value successfully returns a check in form", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const key = "voyageNumber";
            const val = "46";

            return request(app.getHttpServer())
                .get(sprintCheckinUrl)
                .query({ [key]: val })
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining(formResponseCheckinShape),
                        ]),
                    );
                });
        });

        it("should return 200 if teamId key's value successfully returns a check in form", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const key = "teamId";
            const val = "1";

            return request(app.getHttpServer())
                .get(sprintCheckinUrl)
                .query({ [key]: val })
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining(formResponseCheckinShape),
                        ]),
                    );
                });
        });

        it("should return 200 if sprintNumber key's value successfully returns a check in form", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const key = ["sprintNumber", "voyageNumber"];
            const val = [1, "46"];

            return request(app.getHttpServer())
                .get(sprintCheckinUrl)
                .query({ [key[0]]: val[0], [key[1]]: val[1] })
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining(formResponseCheckinShape),
                        ]),
                    );
                });
        });

        it("should return 200 if userId key's value successfully returns a check in form", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const key = "userId";
            const user = await prisma.voyageTeamMember.findFirst({
                where: {
                    checkinForms: {
                        some: {},
                    },
                },
                select: {
                    userId: true,
                },
            });
            const val = user?.userId;

            return request(app.getHttpServer())
                .get(sprintCheckinUrl)
                .query({ [key]: val })
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining(formResponseCheckinShape),
                        ]),
                    );
                });
        });

        it("should return 400 if query params are invalid", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const key = "teamsId";
            const val = "1";
            return request(app.getHttpServer())
                .get(sprintCheckinUrl)
                .query({ [key]: val })
                .set("Cookie", [access_token, refresh_token])
                .expect(400);
        });

        it("should return 401 if user is not logged in or admin", async () => {
            await request(app.getHttpServer())
                .get(sprintCheckinUrl)
                .expect(401);
        });

        it("should return an empty array if check in form not found", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            // TODO: create user with no check ins
            const key = "teamId";
            const val = "5";
            return request(app.getHttpServer())
                .get(sprintCheckinUrl)
                .query({ [key]: val })
                .set("Cookie", [access_token, refresh_token])
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual(expect.arrayContaining([]));
                });
        });

        it("should return 404 if query not found", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const key = "teamId";
            const val = "9999";
            return request(app.getHttpServer())
                .get(sprintCheckinUrl)
                .query({ [key]: val })
                .set("Cookie", [access_token, refresh_token])
                .expect(404);
        });
    });
});
