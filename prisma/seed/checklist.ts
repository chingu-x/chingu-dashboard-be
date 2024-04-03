import { prisma } from "./prisma-client";

export const populateChecklists = async () => {
    await prisma.checklistItem.createMany({
        data: [
            {
                name: "joinedDiscord",
                description: "Join the Discord",
            },
            {
                name: "chooseTier",
                description: "Choose your Tier",
            },
            {
                name: "soloProjectGuidelines",
                description: "Review the Solo Project Guidelines",
            },
            {
                name: "reviewVoyageProcess",
                description: "Review the Voyage Process",
            },
        ],
    });

    const users = await prisma.user.findMany({});
    const checklistItems = await prisma.checklistItem.findMany({});

    // first user
    await prisma.user.update({
        where: {
            id: users[0].id,
        },
        data: {
            userChecklistStatuses: {
                createMany: {
                    data: [
                        {
                            checklistItemId: checklistItems[0].id,
                            status: true,
                        },
                        {
                            checklistItemId: checklistItems[1].id,
                            status: true,
                        },
                        {
                            checklistItemId: checklistItems[2].id,
                            status: false,
                        },
                        {
                            checklistItemId: checklistItems[3].id,
                            status: false,
                        },
                    ],
                },
            },
        },
    });

    // second user
    await prisma.user.update({
        where: {
            id: users[1].id,
        },
        data: {
            userChecklistStatuses: {
                createMany: {
                    data: [
                        {
                            checklistItemId: checklistItems[0].id,
                            status: true,
                        },
                        {
                            checklistItemId: checklistItems[1].id,
                            status: true,
                        },
                        {
                            checklistItemId: checklistItems[2].id,
                            status: true,
                        },
                        {
                            checklistItemId: checklistItems[3].id,
                            status: false,
                        },
                    ],
                },
            },
        },
    });

    console.log("Checklist status and checklists populated.");
};
