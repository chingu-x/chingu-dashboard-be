import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const populateTablesWithRelations = async () => {
    const voyageTeamMembers = await prisma.voyageTeamMember.findMany({});
    const teamTechStackItems = await prisma.teamTechStackItem.findMany({});

    await prisma.voyageTeamMember.update({
        where: {
            id: voyageTeamMembers[0].id,
        },
        data: {
            projectIdeas: {
                create: [
                    {
                        title: "Title1",
                        description: "description1",
                        vision: "vision1",
                    },
                    {
                        title: "Title2",
                        description: "description2",
                        vision: "vision2",
                    },
                    {
                        title: "Title3",
                        description: "description2",
                        vision: "vision3",
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
                        title: "Title4",
                        description: "description4",
                        vision: "vision4",
                    },
                    {
                        title: "Title5",
                        description: "description5",
                        vision: "vision5",
                    },
                    {
                        title: "Title6",
                        description: "description6",
                        vision: "vision6",
                    },
                ],
            },
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
};
