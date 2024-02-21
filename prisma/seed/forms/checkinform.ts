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
                    {
                        order: 5,
                        inputType: {
                            connect: {
                                name: "checkbox",
                            },
                        },
                        text: "What topics did your meetings cover this week? (Select all that apply)",
                        answerRequired: true,
                        optionGroup: {
                            create: {
                                name: "checkin-meeting-topics",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "We didn't meet",
                                            },
                                            {
                                                text: "Sprint Review",
                                            },
                                            {
                                                text: "Sprint Retrospective",
                                            },
                                            {
                                                text: "Sprint Planning",
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
                        order: 5,
                        inputType: {
                            connect: {
                                name: "yesNo",
                            },
                        },
                        text: "Did you deploy to Production at the end of this Sprint",
                        answerRequired: true,
                    },
                    {
                        order: 6,
                        inputType: {
                            connect: {
                                name: "teamMembersCheckbox",
                            },
                        },
                        text: "Is there anyone on your team who has not been active? If yes, please select the user. If no, move onto the next question.",
                        answerRequired: true,
                    },
                    {
                        order: 7,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Please share any personal or team achievements this week here. (ex. held a meeting, teammate got a job, had a pair programming session, learned a valuable team lesson, solved a challenging problem).",
                        answerRequired: true,
                    },
                    {
                        order: 8,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "If a Product Owner has been assigned to your team do you have feed back to share with us about how that's working?",
                        answerRequired: true,
                    },
                    {
                        order: 9,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "If a Voyage Guide has been assigned to your team do you have feed back to share with us about how that's working?",
                        answerRequired: true,
                    },
                    {
                        order: 10,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Do you have any personal projects you've built that we can showcase in the Weekly Update? (these can be from anytime in your coding history! We want to showcase it!)",
                        answerRequired: true,
                    },
                    {
                        order: 11,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Please provide any extra other comments, concerns, lessons learned, something you want to learn, etc. here. The more the better since this helps us find ways to support teams & improve the process. Thanks!",
                        answerRequired: true,
                    },
                ],
            },
        },
    });
};

/*
{
                        order: 3,
                        inputType: {
                            connect: {
                                name: "radioGroup",
                            },
                        },
                        text: "How did you spend time on your project this week?",
                        answerRequired: true,
                        optionGroup: {
                            create: {
                                name: "time-spent",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "0 hrs.",
                                            },
                                            {
                                                text: "1-4 hrs.",
                                            },
                                            {
                                                text: "5-8 hrs.",
                                            },
                                            {
                                                text: "8+ hrs.",
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
 */
