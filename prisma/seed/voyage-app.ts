import { prisma } from "./prisma-client";

export const populateVoyageApplications = async () => {
    const users = await prisma.user.findMany({});

    const voyageApplicationForm = await prisma.form.findUnique({
        where: {
            title: "Voyage Application Form",
        },
        select: {
            id: true,
            questions: {
                select: {
                    id: true,
                    optionGroup: {
                        select: {
                            optionChoices: {
                                select: {
                                    id: true,
                                    text: true,
                                },
                            },
                        },
                    },
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
                            questionId: voyageApplicationForm.questions[0].id,
                            optionChoiceId:
                                voyageApplicationForm.questions[0].optionGroup
                                    .optionChoices[0].id,
                        },
                        {
                            questionId: voyageApplicationForm.questions[1].id,
                            optionChoiceId:
                                voyageApplicationForm.questions[1].optionGroup
                                    .optionChoices[0].id,
                        },
                    ],
                },
            },
        },
    });

    // solo project entries
    await prisma.voyageApplication.create({
        data: {
            userId: users[0].id,
            voyageId: (
                await prisma.voyage.findUnique({
                    where: {
                        number: "49",
                    },
                })
            ).id,
            formId: voyageApplicationForm.id,
            responseGroupId: responseGroup.id,
        },
    });

    console.log("Voyage Application populated.");
};
