import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { seed } from "../prisma/seed/seed";
import * as request from "supertest";
import * as cookieParser from "cookie-parser";
import { PrismaService } from "../src/prisma/prisma.service";
import { loginAndGetTokens } from "./utils";
import { FormTitles } from "../src/global/constants/formTitles";

describe("VoyagesController e2e Tests", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let accessToken: string;

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
        await app.close();
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        const { access_token } = await loginAndGetTokens(
            "jessica.williamson@gmail.com",
            "password",
            app,
        );
        accessToken = access_token;
    });

    /* This set of tests assume the seed file remains unchanged
    i.e.
    "jessica.williamson@gmail.com" is in team 2
    "dan@random.com" is not in team 2
     */
    describe("POST /submit-project - voyage project submission", () => {
        const voyageProjectSubmissionUrl = "/voyages/submit-project";
        let projectSubmissionForm: any;
        let questions: any;

        beforeEach(async () => {
            projectSubmissionForm = await prisma.form.findUnique({
                where: {
                    title: FormTitles.voyageProjectSubmission,
                },
            });
            questions = await prisma.question.findMany({
                where: {
                    formId: projectSubmissionForm.id,
                },
                select: {
                    id: true,
                },
            });
        });

        it("should return 201 when a project is submitted, and create a record in the database", async () => {
            const responsesBefore = await prisma.response.count();
            const responseGroupBefore = await prisma.responseGroup.count();
            const projectSubmissionBefore =
                await prisma.formResponseVoyageProject.count();

            await request(app.getHttpServer())
                .post(voyageProjectSubmissionUrl)
                .send({
                    voyageTeamId: 2,
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: `Response to question with id ${questions[0].id}`,
                        },
                        {
                            questionId: questions[1].id,
                            text: `Response to question with id ${questions[1].id}`,
                        },
                    ],
                })
                .set("Cookie", accessToken)
                .expect(201);

            const responsesAfter = await prisma.response.count();
            const responseGroupAfter = await prisma.responseGroup.count();
            const projectSubmissionAfter =
                await prisma.formResponseVoyageProject.count();

            expect(responsesAfter).toEqual(responsesBefore + 2);
            expect(responseGroupAfter).toEqual(responseGroupBefore + 1);
            expect(projectSubmissionAfter).toEqual(projectSubmissionBefore + 1);
        });

        it("should return 400 for invalid request body", async () => {
            const responsesBefore = await prisma.response.count();
            const responseGroupBefore = await prisma.responseGroup.count();
            const projectSubmissionBefore =
                await prisma.formResponseVoyageProject.count();

            // missing voyageTeamId
            await request(app.getHttpServer())
                .post(voyageProjectSubmissionUrl)
                .set("Cookie", accessToken)
                .send({
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: `Response to question with id ${questions[0].id}`,
                        },
                        {
                            questionId: questions[1].id,
                            text: `Response to question with id ${questions[1].id}`,
                        },
                    ],
                })
                .expect(400);

            // missing responses
            await request(app.getHttpServer())
                .post(voyageProjectSubmissionUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamId: 2,
                })
                .expect(400);

            // missing questionId in responses - response validation pipe
            await request(app.getHttpServer())
                .post(voyageProjectSubmissionUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamId: 2,
                    responses: [
                        {
                            text: "Text input value",
                        },
                    ],
                })
                .expect(400);

            // missing input in responses - response validation pipe
            await request(app.getHttpServer())
                .post(voyageProjectSubmissionUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamId: 2,
                    responses: [
                        {
                            questionId: questions[0].id,
                        },
                    ],
                })
                .expect(400);

            // wrong response input types
            await request(app.getHttpServer())
                .post(voyageProjectSubmissionUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamId: 2,
                    responses: [
                        {
                            questionId: questions[0].id,
                            numeric: "not a number",
                        },
                    ],
                })
                .expect(400);

            await request(app.getHttpServer())
                .post(voyageProjectSubmissionUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamId: 2,
                    responses: [
                        {
                            questionId: questions[0].id,
                            responseGroupId: "not an id",
                        },
                    ],
                })
                .expect(400);

            await request(app.getHttpServer())
                .post(voyageProjectSubmissionUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamId: 2,
                    responses: [
                        {
                            questionId: questions[0].id,
                            optionGroupId: "not an id",
                        },
                    ],
                })
                .expect(400);

            await request(app.getHttpServer())
                .post(voyageProjectSubmissionUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamId: 2,
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
            const projectSubmissionAfter =
                await prisma.formResponseVoyageProject.count();

            expect(responsesAfter).toEqual(responsesBefore);
            expect(responseGroupAfter).toEqual(responseGroupBefore);
            expect(projectSubmissionAfter).toEqual(projectSubmissionBefore);
        });

        it("should return 401 if user is not logged in", async () => {
            await request(app.getHttpServer())
                .post(voyageProjectSubmissionUrl)
                .send({
                    voyageTeamId: 2,
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: "Text input value",
                        },
                    ],
                })
                .expect(401);
        });

        it("should return 403 if user submitted the form is not in the team", async () => {
            // log in with someone who is not in the team, overriding the user in BeforeAll
            const { access_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );
            accessToken = access_token;

            await request(app.getHttpServer())
                .post(voyageProjectSubmissionUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamId: 2,
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: "Text input value",
                        },
                    ],
                })
                .expect(403);
        });

        it("should return 409 if the team has already submitted a project", async () => {
            // voyageTeam 1 has submitted a project (in seed data)
            await request(app.getHttpServer())
                .post(voyageProjectSubmissionUrl)
                .set("Cookie", accessToken)
                .send({
                    voyageTeamId: 1,
                    responses: [
                        {
                            questionId: questions[0].id,
                            text: "Text input value",
                        },
                    ],
                })
                .expect(409);
        });
    });
});
