import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// TODO: this is incomplete. just added some fields for testing
export const populateSoloProjectForm = async () => {
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "user",
                },
            },
            title: "Solo Project Submission Form",
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Repo Url",
                        answerRequired: true,
                    },
                    {
                        order: 2,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Deployed Url",
                        answerRequired: true,
                    },
                ],
            },
        },
    });
};
