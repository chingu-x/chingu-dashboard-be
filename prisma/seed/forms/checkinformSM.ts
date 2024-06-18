import { prisma } from "../prisma-client";
import { FormTitles } from "../../../src/global/constants/formTitles";

export const populateCheckinFormSM = async () => {
    // Sprint - checkin form (Scrum Master)
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "voyage member",
                },
            },
            title: FormTitles.sprintCheckinSM,
            description:
                "Agile/Scrum is an important part of a Voyage and we'd like some feedback on how you are following ir and how your Product Owner and Scrum Master are helping your team.",
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: "boolean",
                            },
                        },
                        text: "{{Yes,No}} Did your Scrum Master provide any Scrum training or coaching, either during events or through Discord?",
                        answerRequired: true,
                    },
                    {
                        order: 2,
                        inputType: {
                            connect: {
                                name: "boolean",
                            },
                        },
                        text: "{{Yes,No}} Was your Scrum Master effective in resolving issues and removing impediments during sprints?",
                        answerRequired: true,
                    },
                    {
                        order: 3,
                        inputType: {
                            connect: {
                                name: "boolean",
                            },
                        },
                        text: "{{Yes,No}} Did your Scrum Master work to ensure that all Scrum events ran smoothly, stayed positive and productive, and stayed within the designated timebox?",
                        answerRequired: true,
                    },
                    {
                        order: 4,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Is there anything else you'd like to tell us about your Scrum Master?",
                        answerRequired: true,
                    },
                ],
            },
        },
    });
};
