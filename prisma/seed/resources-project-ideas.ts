// VoyageTeams, VoyageMembers, Tech Stack, sprints
import { prisma } from "./prisma-client";

export const populateTeamResourcesAndProjectIdeas = async () => {
    const voyageTeamMembers = await prisma.voyageTeamMember.findMany({});

    await prisma.voyageTeamMember.update({
        where: {
            id: voyageTeamMembers[0].id,
        },
        data: {
            projectIdeas: {
                create: [
                    {
                        title: "Write a poem",
                        description:
                            "A poem is a form of writing that tries to stimulate an emotional response or imaginative awareness within the reader. Many poems have a rhyming structure or follow an established format.",
                        vision: "If you've never written poetry before, start by reading other writers' poems.",
                        projectIdeaVotes: {
                            create: {
                                votedBy: {
                                    connect: {
                                        id: voyageTeamMembers[0].id,
                                    },
                                },
                            },
                        },
                    },
                    {
                        title: "Create custom bookmarks",
                        description:
                            "If you enjoy reading or know others who do, create custom bookmarks. You can make bookmarks out of paper, plastic, cardboard or metal.",
                        vision: "On them, you can include images or quotes the user relates to. This project shows your love for reading and results in thoughtful gifts for fellow readers.",
                        projectIdeaVotes: {
                            create: {
                                votedBy: {
                                    connect: {
                                        id: voyageTeamMembers[0].id,
                                    },
                                },
                            },
                        },
                    },
                    {
                        title: "Create a vision board",
                        description:
                            "A vision board is a poster that represents your goals through images. For example, if one of your goals is to own a house, place images of your ideal home and its features on the board. For a vision board about a career goal, add images of people performing that job. ",
                        vision: "Vision boards not only inspire creativity but also help motivate you toward your goals.",
                        projectIdeaVotes: {
                            create: {
                                votedBy: {
                                    connect: {
                                        id: voyageTeamMembers[0].id,
                                    },
                                },
                            },
                        },
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
                        title: "Exercism",
                    },
                ],
            },
            projectFeatures: {
                create: [
                    {
                        description: "Admin dashboard",
                        category: {
                            connect: {
                                name: "must have",
                            },
                        },
                        order: 1,
                    },
                    {
                        description: "User Accounts",
                        category: {
                            connect: {
                                name: "must have",
                            },
                        },
                        order: 2,
                    },
                    {
                        description: "Themes",
                        category: {
                            connect: {
                                name: "should have",
                            },
                        },
                        order: 1,
                    },
                ],
            },
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
                        description:
                            "Creating a product landing page is one of the most common web development projects for students looking to apply their understanding of web development in real life.",
                        vision: "A product landing page is a focused web page designed to drive conversions and typically includes product details, benefits, and calls to action. Working on this project will give you an opportunity to add some advanced features, like CTAs, to a basic webpage. This project requires you to know HTML, CSS, and JavaScript.",
                        projectIdeaVotes: {
                            create: {
                                votedBy: {
                                    connect: {
                                        id: voyageTeamMembers[1].id,
                                    },
                                },
                            },
                        },
                    },
                    {
                        title: "Netflix Home Page Clone",
                        description:
                            "Creating a Netflix home page clone is a popular one for those interested in learning web development and improving their skills as a beginner. This project involves creating a webpage visually similar to the Netflix home page, including the layout, design, and functionality. This dynamic Netflix clone website project will offer all the tools you need to learn full-stack programming, helping you to master more functionalities. You will also work with a Node.js server to power it and TMDB API to handle all data.",
                        vision: "Follow the steps below.\n\nPlan the project and select the elements.\nBuild the layout and add functionality.\nUse responsive design techniques and develop the webpage.\nTest and launch the webpage.",
                        projectIdeaVotes: {
                            create: {
                                votedBy: {
                                    connect: {
                                        id: voyageTeamMembers[1].id,
                                    },
                                },
                            },
                        },
                    },
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
                        title: "github",
                    },
                ],
            },
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
                        description:
                            "A background generator is a great way to practice CSS skills and familiarize yourself with basic JavaScript concepts. In this project, you will select a basic or a gradient colour and generate it via code. You will then create a webpage that generates random background colours and allows users to customize and copy the generated colour code. This will help you practice your basics and give you a touch of interface design.",
                        vision: "This will help you practice your basics and give you a touch of interface design.",
                        projectIdeaVotes: {
                            create: {
                                votedBy: {
                                    connect: {
                                        id: voyageTeamMembers[2].id,
                                    },
                                },
                            },
                        },
                    },
                    {
                        title: "Temperature Converter Website",
                        description:
                            "Developing a website that converts temperature recorded in one unit to another can be an excellent place for web developers to move forward in their web development journey.",
                        vision: "The measuring units of the temperature recorded in a particular unit can be converted with a temperature converter, necessitating you to build a dropdown menu with temperature scales. You can also more functionality to the website by providing some other converters.",
                        projectIdeaVotes: {
                            create: {
                                votedBy: {
                                    connect: {
                                        id: voyageTeamMembers[2].id,
                                    },
                                },
                            },
                        },
                    },
                    {
                        title: "Github Explorer",
                        description:
                            "GitHub is a fantastic platform that simplifies your life, has the potential to set you apart from other web developers, and hosts some of the most significant and fascinating coding projects now being worked on.",
                        vision: "A GitHub explorer is a moderately challenging project that will test your skills and knowledge beyond the basics about HTML, JavaScript, and other web development programming languages. With this project, you can build a search for repositories by keywords, filter them, view their details, enable people to save their favorite repositories, and delete them.",
                        projectIdeaVotes: {
                            create: {
                                votedBy: {
                                    connect: {
                                        id: voyageTeamMembers[2].id,
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            teamResources: {
                create: [
                    {
                        url: "http://trello.com/",
                        title: "Trello",
                    },
                ],
            },
            projectFeatures: {
                create: [
                    {
                        description: "Save links",
                        category: {
                            connect: {
                                name: "should have",
                            },
                        },
                        order: 2,
                    },
                    {
                        description: "Share on LinkedIn",
                        category: {
                            connect: {
                                name: "nice to have",
                            },
                        },
                        order: 1,
                    },
                    {
                        description: "Friend List",
                        category: {
                            connect: {
                                name: "must have",
                            },
                        },
                        order: 3,
                    },
                ],
            },
        },
    });

    console.log("Project Ideas, resources populated");
};
