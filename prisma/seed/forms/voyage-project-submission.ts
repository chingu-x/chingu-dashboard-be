import { prisma } from "../prisma-client";
import { FormTitles } from "../../../src/global/constants/formTitles";

export const populateVoyageSubmissionForm = async () => {
    // Voyage - project submission formSelect
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "team",
                },
            },
            title: FormTitles.voyageProjectSubmission,
            description: "Submit and share your finished Chingu project!",
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "What is the name of the project?",
                        answerRequired: true,
                    },
                    {
                        order: 2,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Please describe the project in a sentence or two.",
                        answerRequired: true,
                    },
                    {
                        order: 3,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Please link your Github repo:",
                        answerRequired: true,
                    },
                    {
                        order: 4,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Please link your deployed project:",
                        answerRequired: true,
                    },
                    {
                        order: 5,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "If you have a project showcase video, please provide the public link:",
                        answerRequired: false,
                    },
                    {
                        order: 6,

                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "What stood out as the most positive aspects of your experience:",
                        answerRequired: false,
                    },
                    {
                        order: 7,

                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Is there anything else you'd like to share or comment on regarding your experience?",
                        answerRequired: false,
                    },
                    {
                        order: 8,
                        inputType: {
                            connect: {
                                name: "scale",
                            },
                        },
                        text: "{{Not Likely,Extremely Likely}}On a scale of 0-10, how likely are you to suggest Chingu to a friend or colleague?",
                        answerRequired: true,
                        optionGroup: {
                            create: {
                                name: "chingu-scale",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "1",
                                            },
                                            {
                                                text: "2",
                                            },
                                            {
                                                text: "3",
                                            },
                                            {
                                                text: "4",
                                            },
                                            {
                                                text: "5",
                                            },
                                            {
                                                text: "6",
                                            },
                                            {
                                                text: "7",
                                            },
                                            {
                                                text: "8",
                                            },
                                            {
                                                text: "9",
                                            },
                                            {
                                                text: "10",
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        },
    });
};
