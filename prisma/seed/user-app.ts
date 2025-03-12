import { prisma } from "./prisma-client";
import { FormTitles } from "@/global/constants/formTitles";

export const populateUserApplications = async () => {
    const user = await prisma.user.findFirst();

    const userApplicationForm = await prisma.form.findUnique({
        where: {
            title: FormTitles.userApplication,
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
                    order: true,
                },
                orderBy: {
                    order: "asc",
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
                            questionId: userApplicationForm!.questions[0].id,
                            text: "Jessica",
                        },
                        {
                            questionId: userApplicationForm!.questions[1].id,
                            text: "Williamson",
                        },
                        {
                            // gender
                            questionId: userApplicationForm!.questions[2].id,
                            optionChoiceId:
                                userApplicationForm!.questions[2].optionGroup
                                    ?.optionChoices[0].id,
                        },
                        {
                            // country code, dropdown populated by frontend, returning a string
                            questionId: userApplicationForm!.questions[3].id,
                            text: "AU",
                        },
                        // "What features are you most excited about" (max 3 choices)
                        {
                            questionId: userApplicationForm!.questions[5].id,
                            optionChoiceId:
                                userApplicationForm!.questions[5].optionGroup
                                    ?.optionChoices[0].id,
                        },
                        {
                            questionId: userApplicationForm!.questions[5].id,
                            optionChoiceId:
                                userApplicationForm!.questions[5].optionGroup
                                    ?.optionChoices[1].id,
                        },
                        // how did you hear about us
                        {
                            questionId: userApplicationForm!.questions[7].id,
                            optionChoiceId:
                                userApplicationForm!.questions[7].optionGroup
                                    ?.optionChoices[1].id,
                        },
                        // linkedIn
                        {
                            questionId: userApplicationForm!.questions[9].id,
                            text: "http://www.linkedIn/profile",
                        },
                    ],
                },
            },
        },
    });

    // user application ( new user onboarding)
    await prisma.userApplication.create({
        data: {
            userId: user!.id,
            formId: userApplicationForm!.id,
            responseGroupId: responseGroup.id,
        },
    });
};
