// TODO: this is incomplete. just added some fields for testing
import { prisma } from "../prisma-client";
import { FormTitles } from "../../../src/global/constants/formTitles";
export const populateSoloProjectForm = async () => {
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "user",
                },
            },
            title: FormTitles.soloProjectSubmission,
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
                    {
                        order: 3,
                        inputType: {
                            connect: {
                                name: "radio",
                            },
                        },
                        text: "Tier",
                        answerRequired: true,
                    },
                ],
            },
        },
    });
};
