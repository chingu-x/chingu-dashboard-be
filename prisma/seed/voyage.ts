import { prisma } from "./prisma-client";

export const populateVoyages = async () => {
    await prisma.voyage.create({
        data: {
            number: "46",
            status: {
                connect: {
                    name: "Inactive",
                },
            },
            startDate: new Date("2023-11-06"),
            endDate: new Date("2023-12-17T23:59:59.000Z"),
            soloProjectDeadline: new Date("2023-11-04T23:59:59.000Z"),
            certificateIssueDate: new Date("2023-12-31T23:59:59.000Z"),
        },
    });

    await prisma.voyage.create({
        data: {
            number: "47",
            status: {
                connect: {
                    name: "Active",
                },
            },
            startDate: new Date("2024-01-08"),
            endDate: new Date("2024-02-18T23:59:59.000Z"),
            soloProjectDeadline: new Date("2023-12-31T23:59:59.000Z"),
            certificateIssueDate: new Date("2024-02-25T23:59:59.000Z"),
        },
    });
    await prisma.voyage.create({
        data: {
            number: "48",
            status: {
                connect: {
                    name: "Upcoming",
                },
            },
            startDate: new Date("2024-03-05"),
            endDate: new Date("2024-04-14T23:59:59.000Z"),
            soloProjectDeadline: new Date("2024-02-25T23:59:59.000Z"),
            certificateIssueDate: new Date("2024-04-21T23:59:59.000Z"),
        },
    });
    await prisma.voyage.create({
        data: {
            number: "49",
            status: {
                connect: {
                    name: "Upcoming",
                },
            },
            startDate: new Date("2024-05-06"),
            endDate: new Date("2024-06-16T23:59:59.000Z"),
            soloProjectDeadline: new Date("2024-04-28T23:59:59.000Z"),
            certificateIssueDate: new Date("2024-06-23T23:59:59.000Z"),
        },
    });
};
