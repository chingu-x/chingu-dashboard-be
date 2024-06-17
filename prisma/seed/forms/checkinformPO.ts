import { prisma } from "../prisma-client";
import { FormTitles } from "../../../src/global/constants/formTitles";

export const populateCheckinFormPO = async () => {
    // Sprint - checkin form (Product owner)

    const checkinFormPO = await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "voyage member",
                },
            },
            title: FormTitles.sprintCheckinPO,
            description: "PO Feedback from Team members",
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: "checkbox",
                            },
                        },
                        text: "In what are your Product Owner's strengths?",
                        answerRequired: true,
                        optionGroup: {
                            create: {
                                name: "checkin-form-po-strengths",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "I don't have any feedback at this time",
                                            },
                                            {
                                                text: "Ordering the product backlog",
                                            },
                                            {
                                                text: "Creating user stories and tasks",
                                            },
                                            {
                                                text: "Being empowered",
                                            },
                                            {
                                                text: "Collaborating",
                                            },
                                            {
                                                text: "Motivating",
                                            },
                                            {
                                                text: "Technical Knowledge",
                                            },
                                            {
                                                text: "Communicating",
                                            },
                                            {
                                                text: "Problem solving",
                                            },
                                            {
                                                text: "Listening",
                                            },
                                            {
                                                text: "Self-managing",
                                            },
                                            {
                                                text: "Other",
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    {
                        order: 2,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Is there anything else you'd like to tell us about your PO?",
                        answerRequired: true,
                    },
                ],
            },
        },
    });
};
