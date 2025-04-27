import { prisma } from "./prisma-client";

export const populateDefaultProjects = async () => {
    // Default Projects for Voyage 53
    await prisma.defaultVoyageProject.create({
        data: {
            repoUrl:
                "https://github.com/chingu-voyages/voyage-project-tier1-menu-scheduler",
            title: "voyage-project-tier1-menu-scheduler",
            overview:
                "This project focuses on developing a menu scheduling application that allows managers to create and share weekly menus for staff workers. The application ensures employees have clear visibility of the planned meals while addressing specific dietary restrictions and allergies.",
            tier: {
                connect: {
                    name: "Tier 1",
                },
            },
            voyage: {
                connect: {
                    number: "53",
                },
            },
        },
    });
    await prisma.defaultVoyageProject.create({
        data: {
            repoUrl:
                "https://github.com/chingu-voyages/voyage-project-tier2-menu-scheduler",
            title: "voyage-project-tier2-menu-scheduler",
            overview:
                "This project focuses on developing a menu scheduling application that allows managers to create and share weekly menus for staff workers. The application ensures employees have clear visibility of the planned meals while addressing specific dietary restrictions and allergies.",
            tier: {
                connect: {
                    name: "Tier 2",
                },
            },
            voyage: {
                connect: {
                    number: "53",
                },
            },
        },
    });

    await prisma.defaultVoyageProject.create({
        data: {
            repoUrl:
                "https://github.com/chingu-voyages/voyage-project-tier3-menu-scheduler",
            title: "voyage-project-tier3-menu-scheduler",
            overview:
                "This project focuses on developing a menu scheduling application that allows managers to create and share weekly menus for staff workers. The application ensures employees have clear visibility of the planned meals while addressing specific dietary restrictions and allergies.",
            tier: {
                connect: {
                    name: "Tier 3",
                },
            },
            voyage: {
                connect: {
                    number: "53",
                },
            },
        },
    });

    // Default Projects for Voyage 54
    await prisma.defaultVoyageProject.create({
        data: {
            repoUrl:
                "https://github.com/chingu-voyages/voyage-project-tier1-menu-scheduler",
            title: "voyage-project-tier1-menu-scheduler",
            overview:
                "This project focuses on developing a menu scheduling application that allows managers to create and share weekly menus for staff workers. The application ensures employees have clear visibility of the planned meals while addressing specific dietary restrictions and allergies.",
            tier: {
                connect: {
                    name: "Tier 1",
                },
            },
            voyage: {
                connect: {
                    number: "54",
                },
            },
        },
    });
    await prisma.defaultVoyageProject.create({
        data: {
            repoUrl:
                "https://github.com/chingu-voyages/voyage-project-tier2-menu-scheduler",
            title: "voyage-project-tier2-menu-scheduler",
            overview:
                "This project focuses on developing a menu scheduling application that allows managers to create and share weekly menus for staff workers. The application ensures employees have clear visibility of the planned meals while addressing specific dietary restrictions and allergies.",
            tier: {
                connect: {
                    name: "Tier 2",
                },
            },
            voyage: {
                connect: {
                    number: "54",
                },
            },
        },
    });

    await prisma.defaultVoyageProject.create({
        data: {
            repoUrl:
                "https://github.com/chingu-voyages/voyage-project-tier3-menu-scheduler",
            title: "voyage-project-tier3-menu-scheduler",
            overview:
                "This project focuses on developing a menu scheduling application that allows managers to create and share weekly menus for staff workers. The application ensures employees have clear visibility of the planned meals while addressing specific dietary restrictions and allergies.",
            tier: {
                connect: {
                    name: "Tier 3",
                },
            },
            voyage: {
                connect: {
                    number: "54",
                },
            },
        },
    });

    // Default Projects for Voyage 55
    await prisma.defaultVoyageProject.create({
        data: {
            repoUrl:
                "https://github.com/chingu-voyages/voyage-project-tier1-menu-scheduler",
            title: "voyage-project-tier1-menu-scheduler",
            overview:
                "This project focuses on developing a menu scheduling application that allows managers to create and share weekly menus for staff workers. The application ensures employees have clear visibility of the planned meals while addressing specific dietary restrictions and allergies.",
            tier: {
                connect: {
                    name: "Tier 1",
                },
            },
            voyage: {
                connect: {
                    number: "55",
                },
            },
        },
    });
    await prisma.defaultVoyageProject.create({
        data: {
            repoUrl:
                "https://github.com/chingu-voyages/voyage-project-tier2-menu-scheduler",
            title: "voyage-project-tier2-menu-scheduler",
            overview:
                "This project focuses on developing a menu scheduling application that allows managers to create and share weekly menus for staff workers. The application ensures employees have clear visibility of the planned meals while addressing specific dietary restrictions and allergies.",
            tier: {
                connect: {
                    name: "Tier 2",
                },
            },
            voyage: {
                connect: {
                    number: "55",
                },
            },
        },
    });

    await prisma.defaultVoyageProject.create({
        data: {
            repoUrl:
                "https://github.com/chingu-voyages/voyage-project-tier3-menu-scheduler",
            title: "voyage-project-tier3-menu-scheduler",
            overview:
                "This project focuses on developing a menu scheduling application that allows managers to create and share weekly menus for staff workers. The application ensures employees have clear visibility of the planned meals while addressing specific dietary restrictions and allergies.",
            tier: {
                connect: {
                    name: "Tier 3",
                },
            },
            voyage: {
                connect: {
                    number: "55",
                },
            },
        },
    });

    // Default Projects for Voyage 56
    await prisma.defaultVoyageProject.create({
        data: {
            repoUrl:
                "https://github.com/chingu-voyages/voyage-project-tier1-menu-scheduler",
            title: "voyage-project-tier1-menu-scheduler",
            overview:
                "This project focuses on developing a menu scheduling application that allows managers to create and share weekly menus for staff workers. The application ensures employees have clear visibility of the planned meals while addressing specific dietary restrictions and allergies.",
            tier: {
                connect: {
                    name: "Tier 1",
                },
            },
            voyage: {
                connect: {
                    number: "56",
                },
            },
        },
    });
    await prisma.defaultVoyageProject.create({
        data: {
            repoUrl:
                "https://github.com/chingu-voyages/voyage-project-tier2-menu-scheduler",
            title: "voyage-project-tier2-menu-scheduler",
            overview:
                "This project focuses on developing a menu scheduling application that allows managers to create and share weekly menus for staff workers. The application ensures employees have clear visibility of the planned meals while addressing specific dietary restrictions and allergies.",
            tier: {
                connect: {
                    name: "Tier 2",
                },
            },
            voyage: {
                connect: {
                    number: "56",
                },
            },
        },
    });

    await prisma.defaultVoyageProject.create({
        data: {
            repoUrl:
                "https://github.com/chingu-voyages/voyage-project-tier3-menu-scheduler",
            title: "voyage-project-tier3-menu-scheduler",
            overview:
                "This project focuses on developing a menu scheduling application that allows managers to create and share weekly menus for staff workers. The application ensures employees have clear visibility of the planned meals while addressing specific dietary restrictions and allergies.",
            tier: {
                connect: {
                    name: "Tier 3",
                },
            },
            voyage: {
                connect: {
                    number: "56",
                },
            },
        },
    });
};
