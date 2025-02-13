import { FormTitles } from "../../src/global/constants/formTitles";
import { passedSampleFeedback } from "./data/text/solo-project-feedback";
import { prisma } from "./prisma-client";

export const populateSoloProjects = async () => {
    // solo project status
    // TODO update this to generate from global/constants/statuses
    await prisma.soloProjectStatus.createMany({
        data: [
            { status: "Waiting Evaluation" },
            { status: "Requested Changes" },
            { status: "Passed" },
            { status: "No Pass" },
            { status: "No Response" },
            { status: "Not in Discord" },
        ],
    });

    const users = await prisma.user.findMany({});

    const soloProjectForm = await prisma.form.findUnique({
        where: {
            title: FormTitles.soloProjectSubmission,
        },
        select: {
            id: true,
            questions: {
                orderBy: {
                    order: "asc",
                },
                select: {
                    id: true,
                },
            },
        },
    });

    // Solo Project 1
    const responseGroup = await prisma.responseGroup.create({
        data: {
            responses: {
                createMany: {
                    data: [
                        {
                            questionId: soloProjectForm!.questions[0].id,
                            text: "www.github.com/repo",
                        },
                        {
                            questionId: soloProjectForm!.questions[1].id,
                            text: "www.vercel.com",
                        },
                    ],
                },
            },
        },
    });

    await prisma.soloProject.create({
        data: {
            userId: users[0].id,
            comments: {
                createMany: {
                    data: [
                        {
                            authorId: users[1].id,
                            content: "This is a tier 2 project, not tier 3",
                            type: "SoloProject",
                        },
                        {
                            authorId: users[2].id,
                            content: "ok",
                            parentCommentId: 1,
                            type: "SoloProject",
                            path: "/1",
                        },
                        {
                            content: "not ok",
                            parentCommentId: 2,
                            type: "SoloProject",
                            path: "/1/2",
                        },
                    ],
                },
            },
            evaluatorUserId: users[1].id,
            evaluatorFeedback: passedSampleFeedback,
            statusId: (await prisma.soloProjectStatus.findUnique({
                where: {
                    status: "Waiting Evaluation",
                },
            }))!.id,
            formId: soloProjectForm!.id,
            responseGroupId: responseGroup.id,
        },
    });

    // Solo Project 2
    const responseGroup2 = await prisma.responseGroup.create({
        data: {
            responses: {
                createMany: {
                    data: [
                        {
                            questionId: soloProjectForm!.questions[0].id,
                            text: "www.github.com/repo2",
                        },
                        {
                            questionId: soloProjectForm!.questions[1].id,
                            text: "www.vercel.com/2",
                        },
                    ],
                },
            },
        },
    });

    await prisma.soloProject.create({
        data: {
            userId: users[5].id,
            evaluatorUserId: users[2].id,
            evaluatorFeedback: passedSampleFeedback,
            statusId: (await prisma.soloProjectStatus.findUnique({
                where: {
                    status: "Waiting Evaluation",
                },
            }))!.id,
            formId: soloProjectForm!.id,
            responseGroupId: responseGroup2.id,
        },
    });

    // Solo Project 3 (with option choices)
    const responseGroup3 = await prisma.responseGroup.create({
        data: {
            responses: {
                createMany: {
                    data: [
                        {
                            questionId: soloProjectForm!.questions[0].id,
                            text: "www.github.com/repo3",
                        },
                        {
                            questionId: soloProjectForm!.questions[1].id,
                            text: "www.vercel.com/3",
                        },
                        {
                            questionId: soloProjectForm!.questions[2].id,
                            optionChoiceId: 44,
                        },
                    ],
                },
            },
        },
    });

    await prisma.soloProject.create({
        data: {
            userId: users[6].id,
            evaluatorUserId: users[3].id,
            evaluatorFeedback: passedSampleFeedback,
            statusId: (await prisma.soloProjectStatus.findUnique({
                where: {
                    status: "Requested Changes",
                },
            }))!.id,
            formId: soloProjectForm!.id,
            responseGroupId: responseGroup3.id,
        },
    });

    const statuses = await prisma.soloProjectStatus.findMany({});

    for (let i = 0; i < 40; i++) {
        await prisma.soloProject.create({
            data: {
                userId: users[5].id,
                evaluatorUserId: users[2].id,
                evaluatorFeedback: passedSampleFeedback,
                statusId: (await prisma.soloProjectStatus.findUnique({
                    where: {
                        status: statuses[
                            Math.floor(Math.random() * statuses.length)
                        ].status,
                    },
                }))!.id,
                formId: soloProjectForm!.id,
            },
        });
    }

    console.log("Solo projects populated.");
};
