import { FormTitles } from "../../src/global/constants/formTitles";
import { passedSampleFeedback } from "./data/text/solo-project-feedback";
import { prisma } from "./prisma-client";

export const populateSoloProjects = async () => {
    // solo project status
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
                select: {
                    id: true,
                },
            },
        },
    });

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

    // solo project entries
    await prisma.soloProject.create({
        data: {
            userId: users[0].id,
            comments: {
                createMany: {
                    data: [
                        { commentText: "This is a tier 2 project, not tier 3" },
                        { commentText: "ok", parentCommentId: 1 },
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

    await prisma.soloProject.create({
        data: {
            userId: users[7].id,
            evaluatorUserId: users[2].id,
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

    console.log("Solo projects populated.");
};
