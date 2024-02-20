import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const populateCheckinForm = async () => {
    // Sprint - checkin form
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "voyage member",
                },
            },
            title: "Sprint Check-in",
            description:
                "The weekly Chingu Check-in is how we support you and your team. It is also how we identify teams and individuals who need help. So, please make sure you submit this every week.",
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: "radio",
                            },
                        },
                        text: "How did you communicate with your team this past week?",
                        answerRequired: true,
                        optionGroup: {
                            create: {
                                name: "checkin-form-communicate-how",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "I didn't communicate with my team",
                                            },
                                            {
                                                text: "Only in Team Channel",
                                            },
                                            {
                                                text: "Only in Team Meeting(s)",
                                            },
                                            {
                                                text: "Team Channel + Team Meeting(s)",
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
                                name: "radio",
                            },
                        },
                        text: "Did you contribute to the project for your team this past week?",
                        answerRequired: true,
                        optionGroup: {
                            create: {
                                name: "checkin-form-contribution",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "Yes, worked on my own",
                                            },
                                            {
                                                text: "Yes, worked with another teammate",
                                            },
                                            {
                                                text: "Yes, worked on my own + with another teammate",
                                            },
                                            {
                                                text: "No, I didn't work on the project this past week",
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    {
                        order: 4,
                        inputType: {
                            connect: {
                                name: "radio",
                            },
                        },
                        text: "How would you rate your team's progress right now?",
                        answerRequired: true,
                        optionGroup: {
                            create: {
                                name: "checkin-form-progress",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "We have had a good start!",
                                            },
                                            {
                                                text: "I'm nervous we won't finish",
                                            },
                                            {
                                                text: "It doesn't look good right now",
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
