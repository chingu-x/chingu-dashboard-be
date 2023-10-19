import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

const addDays = (date, days) => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + days)
    return newDate
}

const getSprintId = async (teamVoyageId, sprintNumber) => {
    const sprint = await prisma.sprint.findUnique({
        where: {
            voyageSprintNumber: {
                voyageId: teamVoyageId,
                number: sprintNumber
            }
        }
    })
    return sprint.id
}

const getRandomDateDuringSprint = async(sprintId) => {
    const sprint = await prisma.sprint.findUnique({
        where:{
            id: sprintId
        }
    })
    return addDays(sprint.startDate, Math.floor(Math.random() * 6))
}

// VoyageTeams, VoyageMembers, Tech Stack, sprints
export const populateTablesWithRelations = async () => {
    const voyageTeamMembers = await prisma.voyageTeamMember.findMany({});
    const teamTechStackItems = await prisma.teamTechStackItem.findMany({});
    const voyages = await prisma.voyage.findMany({});
    const voyageTeams = await prisma.voyageTeam.findMany({})

    await prisma.voyageTeamMember.update({
        where: {
            id: voyageTeamMembers[0].id,
        },
        data: {
            projectIdeas: {
                create: [
                    {
                        title: "Write a poem",
                        description: "A poem is a form of writing that tries to stimulate an emotional response or imaginative awareness within the reader. Many poems have a rhyming structure or follow an established format.",
                        vision: "If you've never written poetry before, start by reading other writers' poems.",
                    },
                    {
                        title: "Create custom bookmarks",
                        description: "If you enjoy reading or know others who do, create custom bookmarks. You can make bookmarks out of paper, plastic, cardboard or metal.",
                        vision: "On them, you can include images or quotes the user relates to. This project shows your love for reading and results in thoughtful gifts for fellow readers.",
                    },
                    {
                        title: "Create a vision board",
                        description: "A vision board is a poster that represents your goals through images. For example, if one of your goals is to own a house, place images of your ideal home and its features on the board. For a vision board about a career goal, add images of people performing that job. ",
                        vision: "Vision boards not only inspire creativity but also help motivate you toward your goals.",
                    },
                ],
            },
            teamResources: {
                create: [
                    {
                        url: "https://hacktoberfest.com/",
                        title: "Hecktoberfest - CELEBRATE OUR 10TH YEAR SUPPORTING OPEN SOURCE!",
                    },
                    {
                        url: "https://exercism.org/",
                        title: "Exercism"
                    }
                ]
            },
            projectFeatures: {
                create: [
                    {
                        description: "Admin dashboard",
                        category: {
                            connect: {
                                name: 'must have',
                            }
                        }
                    },
                    {
                        description: "User Accounts",
                        category: {
                            connect: {
                                name: 'must have',
                            }
                        }
                    },
                    {
                        description: "Themes",
                        category: {
                            connect: {
                                name: 'should have',
                            }
                        }
                    }
                ]
            }
        },
    });

    await prisma.voyageTeamMember.update({
        where: {
            id: voyageTeamMembers[1].id,
        },
        data: {
            projectIdeas: {
                create: [
                    {
                        title: "Product Landing Page",
                        description: "Creating a product landing page is one of the most common web development projects for students looking to apply their understanding of web development in real life.",
                        vision: "A product landing page is a focused web page designed to drive conversions and typically includes product details, benefits, and calls to action. Working on this project will give you an opportunity to add some advanced features, like CTAs, to a basic webpage. This project requires you to know HTML, CSS, and JavaScript.",
                    },
                    {
                        title: "Netflix Home Page Clone",
                        description: "Creating a Netflix home page clone is a popular one for those interested in learning web development and improving their skills as a beginner. This project involves creating a webpage visually similar to the Netflix home page, including the layout, design, and functionality. This dynamic Netflix clone website project will offer all the tools you need to learn full-stack programming, helping you to master more functionalities. You will also work with a Node.js server to power it and TMDB API to handle all data.",
                        vision: "Follow the steps below.\n\nPlan the project and select the elements.\nBuild the layout and add functionality.\nUse responsive design techniques and develop the webpage.\nTest and launch the webpage.",
                    }
                ],
            },
            teamResources: {
                create: [
                    {
                        url: "http://chingu.io",
                        title: "Chingu Website",
                    },
                    {
                        url: "www.github.com",
                        title: "github"
                    }
                ]
            }
        },
    });

    await prisma.voyageTeamMember.update({
        where: {
            id: voyageTeamMembers[2].id,
        },
        data: {
            projectIdeas: {
                create: [
                    {
                        title: "Background Generator ",
                        description: "A background generator is a great way to practice CSS skills and familiarize yourself with basic JavaScript concepts. In this project, you will select a basic or a gradient colour and generate it via code. You will then create a webpage that generates random background colours and allows users to customize and copy the generated colour code. This will help you practice your basics and give you a touch of interface design.",
                        vision: "This will help you practice your basics and give you a touch of interface design.",
                    },
                    {
                        title: "Temperature Converter Website",
                        description: "Developing a website that converts temperature recorded in one unit to another can be an excellent place for web developers to move forward in their web development journey.",
                        vision: "The measuring units of the temperature recorded in a particular unit can be converted with a temperature converter, necessitating you to build a dropdown menu with temperature scales. You can also more functionality to the website by providing some other converters.",
                    },
                    {
                        title: "Github Explorer",
                        description: "GitHub is a fantastic platform that simplifies your life, has the potential to set you apart from other web developers, and hosts some of the most significant and fascinating coding projects now being worked on.",
                        vision: "A GitHub explorer is a moderately challenging project that will test your skills and knowledge beyond the basics about HTML, JavaScript, and other web development programming languages. With this project, you can build a search for repositories by keywords, filter them, view their details, enable people to save their favorite repositories, and delete them.",
                    },
                ],
            },
            teamResources: {
                create: [
                    {
                        url: "http://trello.com/",
                        title: "Trello",
                    }
                ]
            },
            projectFeatures: {
                create: [
                    {
                        description: "Save links",
                        category: {
                            connect: {
                                name: 'should have',
                            }
                        }
                    },
                    {
                        description: "Share on LinkedIn",
                        category: {
                            connect: {
                                name: 'nice to have',
                            }
                        }
                    },
                    {
                        description: "Friend List",
                        category: {
                            connect: {
                                name: 'must have',
                            }
                        }
                    }
                ]
            }
        },
    });

    await prisma.teamTechStackItem.update({
        where: {
            id: teamTechStackItems[0].id,
        },
        data: {
            teamTechStackItemVotes: {
                create: [
                    {
                        votedBy: {
                            connect: {
                                id: voyageTeamMembers[0].id,
                            },
                        },
                    },
                    {
                        votedBy: {
                            connect: {
                                id: voyageTeamMembers[1].id,
                            },
                        },
                    },
                ],
            },

        },
    });

    await prisma.teamTechStackItem.update({
        where: {
            id: teamTechStackItems[1].id,
        },
        data: {
            teamTechStackItemVotes: {
                create: [
                    {
                        votedBy: {
                            connect: {
                                id: voyageTeamMembers[0].id,
                            },
                        },
                    },
                ],
            },
        },
    });

    await prisma.teamTechStackItem.update({
        where: {
            id: teamTechStackItems[2].id,
        },
        data: {
            teamTechStackItemVotes: {
                create: [
                    {
                        votedBy: {
                            connect: {
                                id: voyageTeamMembers[1].id,
                            },
                        },
                    },
                ],
            },
        },
    });

    await prisma.voyage.update({
        where: {
            id: voyages[0].id
        },
        data: {
            sprints: {
                create: [
                    {
                        number: 1,
                        startDate: voyages[0].startDate,
                        endDate: addDays(voyages[0].startDate, 6),
                    },
                    {
                        number: 2,
                        startDate: addDays(voyages[0].startDate, 7),
                        endDate: addDays(voyages[0].startDate, 13),
                    },
                    {
                        number: 3,
                        startDate: addDays(voyages[0].startDate, 14),
                        endDate: addDays(voyages[0].startDate, 20),
                    },
                    {
                        number: 4,
                        startDate: addDays(voyages[0].startDate, 21),
                        endDate: addDays(voyages[0].startDate, 27),
                    },
                    {
                        number: 5,
                        startDate: addDays(voyages[0].startDate, 28),
                        endDate: addDays(voyages[0].startDate, 34),
                    },
                    {
                        number: 6,
                        startDate: addDays(voyages[0].startDate, 35),
                        endDate: addDays(voyages[0].startDate, 41),
                    },
                ]
            }
        }
    })

    await prisma.voyage.update({
        where: {
            id: voyages[1].id
        },
        data: {
            sprints: {
                create: [
                    {
                        number: 1,
                        startDate: voyages[1].startDate,
                        endDate: addDays(voyages[1].startDate, 6),
                    },
                    {
                        number: 2,
                        startDate: addDays(voyages[1].startDate, 7),
                        endDate: addDays(voyages[1].startDate, 13),
                    },
                    {
                        number: 3,
                        startDate: addDays(voyages[1].startDate, 14),
                        endDate: addDays(voyages[1].startDate, 20),
                    },
                    {
                        number: 4,
                        startDate: addDays(voyages[1].startDate, 21),
                        endDate: addDays(voyages[1].startDate, 27),
                    },
                    {
                        number: 5,
                        startDate: addDays(voyages[1].startDate, 28),
                        endDate: addDays(voyages[1].startDate, 34),
                    },
                    {
                        number: 6,
                        startDate: addDays(voyages[1].startDate, 35),
                        endDate: addDays(voyages[1].startDate, 41),
                    },
                ]
            }
        }
    })

    await prisma.voyageTeam.update({
        where: {
            id: voyageTeams[0].id,
        },
        data:{
            teamMeetings:{
                create: [
                    {
                        sprintId: await getSprintId(voyageTeams[0].voyageId, 1),
                        title: "First sprint kickoff meeting",
                        dateTime: await getRandomDateDuringSprint(await getSprintId(voyageTeams[0].voyageId, 1)),
                        meetingLink: "meet.google.com/abcdefg",
                        notes:"Title\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis.",
                        agendas: {
                            create: [
                                {
                                    title: "Project Management Tools",
                                    description: "Walk the team through how the Jira board is organized and how we will coordinate communications and tickets.",
                                    status: false
                                },
                                {
                                    title: "Milestone for this week",
                                    description: "FE Team - make homepage responsive\nBE Team - create endpoints for user profile\nDE Team - user flow for the modals",
                                    status: false
                                },
                                {
                                    title: "FE Team",
                                    description: "Title\nPR pushed this week\n- Modals\n- Components\n- Homepage",
                                    status: false
                                },
                                {
                                    title: "BE Team",
                                    description: "Title\nEndpoints created this week\n- Homepage\n- User profile\n- Settings",
                                    status: false
                                }
                            ]
                        },
                    },
                    {
                        sprintId: await getSprintId(voyageTeams[0].voyageId, 2),
                        title: "Second sprint meeting",
                        dateTime: await getRandomDateDuringSprint(await getSprintId(voyageTeams[0].voyageId, 2)),
                        meetingLink: "meet.google.com/hijklm",
                    },
                    {
                        sprintId: await getSprintId(voyageTeams[0].voyageId, 3),
                        title: "Third sprint meeting",
                        dateTime: await getRandomDateDuringSprint(await getSprintId(voyageTeams[0].voyageId, 3)),
                        meetingLink: "meet.google.com/opqrst",
                        notes: "This is a meeting notes"
                    }
                ]
            }
        }
    })
};