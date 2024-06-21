import { prisma } from "../prisma-client";
import { FormTitles } from "../../../src/global/constants/formTitles";

export const populateCheckinFormPO = async () => {
    // Sprint - checkin form (Product owner)
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "voyage member",
                },
            },
            title: FormTitles.sprintCheckinPO,
            description:
                "Agile/Scrum is an important part of a Voyage and we'd like some feedback on how you are following ir and how your Product Owner and Scrum Master are helping your team.",
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: "radio",
                            },
                        },
                        text: "Has a Product Owner been assigned to your team? You can find the roles assigned to your teammates at the top of your voyage Team Channel",
                        answerRequired: true,
                        optionGroup: {
                            create: {
                                name: "checkin-form-po-assigned",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "Yes",
                                            },
                                            {
                                                text: "No",
                                            },
                                            {
                                                text: "I'm the Product Owner",
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
                        order: 3,
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
