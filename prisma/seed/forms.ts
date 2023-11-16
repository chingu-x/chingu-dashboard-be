import { PrismaClient } from "@prisma/client";
import { populateCheckinForm } from "./forms/checkinform";

const prisma = new PrismaClient();

export const populateFormsAndResponses = async () => {
    // test option choices for Voyage Application form
    await prisma.optionChoice.create({
        data: {
            optionGroup: {
                connect: {
                    name: "voyage roles",
                },
            },
            text: "Developer",
        },
    });
    await prisma.optionChoice.create({
        data: {
            optionGroup: {
                connect: {
                    name: "voyage roles",
                },
            },
            text: "Product Owner",
        },
    });
    await prisma.optionChoice.create({
        data: {
            optionGroup: {
                connect: {
                    name: "voyage roles",
                },
            },
            text: "Designer",
        },
    });
    await prisma.optionChoice.create({
        data: {
            optionGroup: {
                connect: {
                    name: "voyage roles",
                },
            },
            text: "Voyage Guide",
        },
    });

    // Sprint - Retrospective and review form
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "meeting",
                },
            },
            title: "Retrospective & Review",
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "What went right?",
                        description: "Share your thoughts on what went right",
                        answerRequired: false,
                    },
                    {
                        order: 2,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "What could be improved?",
                        description:
                            "Share your thoughts on what could be improved for the next sprint",
                        answerRequired: false,
                    },
                    {
                        order: 3,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Changes to be made for the next sprint?",
                        description:
                            "Share your thoughts on what could be changed for the next sprint",
                        answerRequired: false,
                    },
                ],
            },
        },
    });

    // Sprint - Sprint Planning form
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "meeting",
                },
            },
            title: "Sprint Planning",
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Sprint Goal",
                        description:
                            "What is the primary goal of the next sprint?",
                        answerRequired: false,
                    },
                    {
                        order: 2,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Timeline/Tasks",
                        description:
                            "What are some of the goals we want to achieve",
                        answerRequired: false,
                    },
                ],
            },
        },
    });

    // Voyage Application form
    /* needs to be fixed after removing QuestionOption table
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: 'user'
                }
            },
            title: "Voyage Application",
            questions: {
                create: {
                    order: 1,
                    inputType: {
                        connect: {
                            name: 'radio'
                        }
                    },
                    text: 'What role are you applying for?',
                    answerRequired: true,
                    questionOptions: {
                        create: {
                            responses: {
                                create: {
                                    responseUser: {
                                        create: {
                                            user: {
                                                connect: {
                                                    id: users[0].id
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            optionChoice: {
                                connect: {
                                    id: optionChoices[0].id
                                }
                            }
                        }
                    },
                    optionGroup: {
                        connect: {
                            name: 'voyage roles'
                        }
                    }
                }
            }
        },
    })

     */

    // Sprints checkin form
    await populateCheckinForm();

    console.log("Forms, Questions and Responses populated.");
};
