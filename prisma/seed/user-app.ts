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
