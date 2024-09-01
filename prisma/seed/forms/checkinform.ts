import { prisma } from "../prisma-client";
import { FormTitles } from "../../../src/global/constants/formTitles";

export const populateCheckinForm = async () => {
    // Sprint - checkin form
    const checkinForm = await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "voyage member",
                },
            },
            title: FormTitles.sprintCheckin,
            description:
                "The weekly Chingu Check-in is how we support you and your team. It is also how we identify teams and individuals who need help. So, please make sure you submit this every week.",
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: "checkbox",
                            },
                        },
                        text: "Which Scrum events did your team hold in the prior sprint? Please answer 'yes' to any you did even if they were combined in another meeting.",
                        answerRequired: true,
                        optionGroup: {
                            create: {
                                name: "checkin-form-events",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "Project Kickoff (Sprint 1 only)",
                                            },
                                            {
                                                text: "Sprint Planning",
                                            },
                                            {
                                                text: "Sprint Review",
                                            },
                                            {
                                                text: "Sprint Retrospective",
                                            },
                                            {
                                                text: "Daily Standup",
                                            },
                                            {
                                                text: "Backlog Planning/Refinement",
                                            },
                                            {
                                                text: "Team did not hold any Scrum events",
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
                                name: "radioIcon",
                            },
                        },
                        text: "How would you rate your team's progress right now?",
                        answerRequired: true,
                        optionGroup: {
                            create: {
                                name: "checkin-form-team-progress",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "{{greenRocket}} We have had a good start!",
                                            },
                                            {
                                                text: "{{amberRocket}} I'm nervous we won't finish",
                                            },
                                            {
                                                text: "{{redRocket}} It doesn't look good right now",
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
                                name: "radio",
                            },
                        },
                        text: "How did you communicate with your team this past week?",
                        answerRequired: true,
                        optionGroup: {
                            create: {
                                name: "checkin-form-team-communication",
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
                        order: 4,
                        inputType: {
                            connect: {
                                name: "radio",
                            },
                        },
                        text: "Did you contribute to the project this past week by designing, coding, or testing your teams app?",
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
                                                text: "No, I didn't work on the project this past week",
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    {
                        order: 6,
                        inputType: {
                            connect: {
                                name: "boolean",
                            },
                        },
                        text: "{{Yes,No}}Did you deploy to Production at the end of this Sprint?",
                        answerRequired: true,
                    },
                    {
                        order: 7,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Is there anyone on your team who has not been active? If so, please add his/her Discord username here:",
                        answerRequired: false,
                    },

                    {
                        order: 8,
                        inputType: {
                            connect: {
                                name: "teamMembersCheckbox",
                            },
                        },
                        text: "Is there anyone on your team who has been super helpful, kind, hard-working, etc. and deserves a shout-out in the Chingu Weekly? If so, please add his/her Discord username here:",
                        answerRequired: false,
                    },
                    {
                        order: 9,
                        inputType: {
                            connect: {
                                name: "teamMembersCheckbox",
                            },
                        },
                        text: "Please share any personal or team achievements this week here. (ex. held a meeting, teammate got a job, had a pair programming session, learned a valuable team lesson, solved a challenging problem).",
                        answerRequired: false,
                    },
                    {
                        order: 10,
                        inputType: {
                            connect: {
                                name: "radio",
                            },
                        },
                        text: "If a Voyage Guide has been assigned to your team do you have feed back to share with us about how that's working?",
                        answerRequired: true,
                        optionGroup: {
                            create: {
                                name: "checkin-form-guide-feedback",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "My team doesn't have a Voyage Guide",
                                            },
                                            {
                                                text: "I don't know if my team has a Voyage Guide",
                                            },
                                            {
                                                text: "It has been helpful",
                                            },
                                            {
                                                text: "It hasn't been helpful",
                                            },
                                            {
                                                text: "Our team didn't reach out to our Voyage Guide",
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    {
                        order: 11,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Is there anything else you'd like to tell us about your Voyage Guide?",
                        answerRequired: false,
                    },
                    {
                        order: 12,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Please provide any extra other comments, concerns, lessons learned, team achievements, or any additional information you would like to let us know here. ",
                        answerRequired: false,
                    },
                ],
            },
        },
    });

    const radioInput = await prisma.inputType.findUnique({
        where: {
            name: "radio",
        },
    });

    // add the radio group question
    await prisma.question.create({
        data: {
            form: {
                connect: {
                    id: checkinForm.id,
                },
            },
            order: 5,
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
            subQuestions: {
                createMany: {
                    data: [
                        {
                            formId: checkinForm.id,
                            inputTypeId: radioInput!.id,
                            order: 1,
                            text: "Pair programming",
                            answerRequired: true,
                        },
                        {
                            formId: checkinForm.id,
                            inputTypeId: radioInput!.id,
                            order: 2,
                            text: "On my own",
                            answerRequired: true,
                        },
                        {
                            formId: checkinForm.id,
                            inputTypeId: radioInput!.id,
                            order: 3,
                            text: "Learning & research",
                            answerRequired: true,
                        },
                        {
                            formId: checkinForm.id,
                            inputTypeId: radioInput!.id,
                            order: 4,
                            text: "Team activities (e.g. meetings, debugging, etc.)",
                            answerRequired: true,
                        },
                    ],
                },
            },
        },
    });
};
