import { PrismaClient } from "@prisma/client";
import { passedSampleFeedback } from "./data/text/solo-project-feedback";

const prisma = new PrismaClient();

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

    // solo project entries
    await prisma.soloProject.create({
        data: {
            userId: users[0].id,
            adminComments: "This is a tier 3 project, not tier 2",
            evaluatorUserId: users[1].id,
            evaluatorFeedback: passedSampleFeedback,
            statusId: (
                await prisma.soloProjectStatus.findUnique({
                    where: {
                        status: "Waiting Evaluation",
                    },
                })
            ).id,
        },
    });
};
