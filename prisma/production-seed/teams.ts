import { prisma } from "../seed/prisma-client";

export const populateVoyageTeamsProd = async () => {
    await prisma.voyageTeam.create({
        data: {
            voyage: {
                connect: {
                    number: "999",
                },
            },
            name: "v999-tier1-team-1",
            status: {
                connect: {
                    name: "Active",
                },
            },
            tier: {
                connect: {
                    name: "Tier 1",
                },
            },
            repoUrl:
                "https://github.com/chingu-voyages/v46-tier3-chinguweather",
            deployedUrl: "https://www.chingu.io/",
            endDate: new Date("2024-09-29T04:59:59.000Z"),
            voyageTeamMembers: {
                create: [
                    {
                        member: {
                            connect: {
                                email: "jim@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Developer",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 10,
                    },
                    {
                        member: {
                            connect: {
                                email: "razieh@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Product Owner",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 20,
                    },
                    {
                        member: {
                            connect: {
                                email: "mladen@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Developer",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 30,
                    },
                ],
            },
        },
    });

    await prisma.voyageTeam.create({
        data: {
            voyage: {
                connect: {
                    number: "999",
                },
            },
            name: "v999-tier2-team-1",
            status: {
                connect: {
                    name: "Active",
                },
            },
            tier: {
                connect: {
                    name: "Tier 2",
                },
            },
            repoUrl:
                "https://github.com/chingu-voyages/v46-tier3-chinguweather",
            deployedUrl: "https://www.chingu.io/",
            endDate: new Date("2024-09-29T04:59:59.000Z"),
            voyageTeamMembers: {
                create: [
                    {
                        member: {
                            connect: {
                                email: "eury@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "UI/UX Designer",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 10,
                    },
                    {
                        member: {
                            connect: {
                                email: "joe@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Developer",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 10,
                    },
                    {
                        member: {
                            connect: {
                                email: "joseph@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Product Owner",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 20,
                    },
                    {
                        member: {
                            connect: {
                                email: "austin@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Developer",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 30,
                    },
                ],
            },
        },
    });

    await prisma.voyageTeam.create({
        data: {
            voyage: {
                connect: {
                    number: "999",
                },
            },
            name: "v999-tier3-team-1",
            status: {
                connect: {
                    name: "Active",
                },
            },
            tier: {
                connect: {
                    name: "Tier 3",
                },
            },
            repoUrl:
                "https://github.com/chingu-voyages/v46-tier3-chinguweather",
            deployedUrl: "https://www.chingu.io/",
            endDate: new Date("2024-09-29T04:59:59.000Z"),
            voyageTeamMembers: {
                create: [
                    {
                        member: {
                            connect: {
                                email: "dan@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "UI/UX Designer",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 10,
                    },
                    {
                        member: {
                            connect: {
                                email: "jane@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Developer",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 10,
                    },
                    {
                        member: {
                            connect: {
                                email: "timothy@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Product Owner",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 20,
                    },
                    {
                        member: {
                            connect: {
                                email: "winnie@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Developer",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 30,
                    },
                ],
            },
        },
    });

    await prisma.voyageTeam.create({
        data: {
            voyage: {
                connect: {
                    number: "999",
                },
            },
            name: "v999-tier3-team-2",
            status: {
                connect: {
                    name: "Active",
                },
            },
            tier: {
                connect: {
                    name: "Tier 3",
                },
            },
            repoUrl:
                "https://github.com/chingu-voyages/v46-tier3-chinguweather",
            deployedUrl: "https://www.chingu.io/",
            endDate: new Date("2024-09-29T04:59:59.000Z"),
            voyageTeamMembers: {
                create: [
                    {
                        member: {
                            connect: {
                                email: "cheryl@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "UI/UX Designer",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 10,
                    },
                    {
                        member: {
                            connect: {
                                email: "curt@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Developer",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 10,
                    },
                    {
                        member: {
                            connect: {
                                email: "josh@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Product Owner",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 20,
                    },
                    {
                        member: {
                            connect: {
                                email: "tim@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Developer",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 30,
                    },
                    {
                        member: {
                            connect: {
                                email: "arman@example.com",
                            },
                        },
                        voyageRole: {
                            connect: {
                                name: "Developer",
                            },
                        },
                        status: {
                            connect: {
                                name: "Active",
                            },
                        },
                        hrPerSprint: 60,
                    },
                ],
            },
        },
    });

    console.log("[Prod] Voyage teams populated.");
};
