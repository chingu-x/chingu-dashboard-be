import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const populateFormsAndResponses = async () => {
    await prisma.optionChoice.create({
        data: {
            optionGroup: {
                connect: {
                    name: 'voyage roles'
                }
            },
            text: 'Developer'
        }
    })
    await prisma.optionChoice.create({
        data: {
            optionGroup: {
                connect: {
                    name: 'voyage roles'
                }
            },
            text: 'Product Owner'
        }
    })
    await prisma.optionChoice.create({
        data: {
            optionGroup: {
                connect: {
                    name: 'voyage roles'
                }
            },
            text: 'Designer'
        }
    })
    await prisma.optionChoice.create({
        data: {
            optionGroup: {
                connect: {
                    name: 'voyage roles'
                }
            },
            text: 'Voyage Guide'
        }
    })

    // find a meeting Id, just use the first one in this case
    const meetings = await prisma.teamMeeting.findMany({})
    const users = await prisma.user.findMany({})
    const optionChoices = await prisma.optionChoice.findMany({})

    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: 'meeting'
                }
            },
            title: "Retrospective & Review",
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: 'text'
                            }
                        },
                        text: 'What went right?',
                        description: 'Share your thoughts on what went right',
                        answerRequired: false,
                        questionOptions: {
                            create: {
                                responses: {
                                    create: {
                                        responseMeetings: {
                                            create: {
                                                meeting : {
                                                    connect: {
                                                        id: meetings[0].id
                                                    }
                                                }
                                            }
                                        },
                                        responseText: "Everything went well."
                                    }
                                },
                            }
                        }
                    },
                    {
                        order: 2,
                        inputType: {
                            connect: {
                                name: 'text'
                            }
                        },
                        text: 'What could be improved?',
                        description: 'Share your thoughts on what could be improved for the next sprint',
                        answerRequired: false,
                        questionOptions: {
                            create: {
                                responses: {
                                    create: {
                                        responseMeetings: {
                                            create: {
                                                meeting : {
                                                    connect: {
                                                        id: meetings[0].id
                                                    }
                                                }
                                            }
                                        },
                                        responseText: "Communications. Maybe we can do a daily standup in our discord channel"
                                    }
                                },
                            }
                        }
                    },
                    {
                        order: 3,
                        inputType: {
                            connect: {
                                name: 'text'
                            }
                        },
                        text: 'Changes to be made for the next sprint?',
                        description: 'Share your thoughts on what could be changed for the next sprint',
                        answerRequired: false,
                        questionOptions: {
                            create: {
                                responses: {
                                    create: {
                                        responseMeetings: {
                                            create: {
                                                meeting : {
                                                    connect: {
                                                        id: meetings[0].id
                                                    }
                                                }
                                            }
                                        },
                                        responseText: "Not sure."
                                    }
                                },
                            }
                        }
                    }
                ]
            }
        }
    })
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: 'meeting'
                }
            },
            title: "Sprint Planning",
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: 'text'
                            }
                        },
                        text: 'Sprint Goal',
                        description: 'What is the primary goal of the next sprint?',
                        answerRequired: false,
                        questionOptions: {
                            create: {
                                responses: {
                                    create: {
                                        responseMeetings: {
                                            create: {
                                                meeting : {
                                                    connect: {
                                                        id: meetings[0].id
                                                    }
                                                }
                                            }
                                        },
                                        responseText: "Complete all the Must have features"
                                    }
                                },
                            }
                        }
                    },
                    {
                        order: 2,
                        inputType: {
                            connect: {
                                name: 'text'
                            }
                        },
                        text: 'Timeline/Tasks',
                        description: 'What are some of the goals we want to achieve',
                        answerRequired: false,
                        questionOptions: {
                            create: {
                                responses: {
                                    create: {
                                        responseMeetings: {
                                            create: {
                                                meeting : {
                                                    connect: {
                                                        id: meetings[0].id
                                                    }
                                                }
                                            }
                                        },
                                        responseText: "Deploy the app."
                                    }
                                },
                            }
                        }
                    }
                ]
            }
        },
    })
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
                                            user : {
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

    console.log('Forms, Questions and Responses populated.')
}