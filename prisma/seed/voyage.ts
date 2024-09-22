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
            startDate: new Date("2023-11-06T17:00:00.000Z"),
            endDate: new Date("2023-12-18T04:59:59.000Z"),
            soloProjectDeadline: new Date("2023-11-05T06:59:59.000Z"),
            certificateIssueDate: new Date("2024-01-01T06:59:59.000Z"),
        },
    });

    await prisma.voyage.create({
        data: {
            number: "47",
            status: {
                connect: {
                    name: "Inactive",
                },
            },
            startDate: new Date("2024-01-08T17:00:00.000Z"),
            endDate: new Date("2024-02-19T04:59:59.000Z"),
            soloProjectDeadline: new Date("2024-01-01T06:59:59.000Z"),
            certificateIssueDate: new Date("2024-02-26T06:59:59.000Z"),
        },
    });
    await prisma.voyage.create({
        data: {
            number: "48",
            status: {
                connect: {
                    name: "Inactive",
                },
            },
            startDate: new Date("2024-03-05T17:00:00.000Z"),
            endDate: new Date("2024-04-15T04:59:59.000Z"),
            soloProjectDeadline: new Date("2024-02-26T06:59:59.000Z"),
            certificateIssueDate: new Date("2024-04-22T06:59:59.000Z"),
        },
    });
    await prisma.voyage.create({
        data: {
            number: "49",
            status: {
                connect: {
                    name: "Inactive",
                },
            },
            startDate: new Date("2024-05-06T17:00:00.000Z"),
            endDate: new Date("2024-06-17T04:59:59.000Z"),
            soloProjectDeadline: new Date("2024-04-29T06:59:59.000Z"),
            certificateIssueDate: new Date("2024-06-24T06:59:59.000Z"),
        },
    });
    await prisma.voyage.create({
        data: {
            number: "50",
            status: {
                connect: {
                    name: "Inactive",
                },
            },
            startDate: new Date("2024-07-01T17:00:00.000Z"),
            endDate: new Date("2024-08-12T04:59:59.000Z"),
            soloProjectDeadline: new Date("2024-06-24T06:59:59.000Z"),
            certificateIssueDate: new Date("2024-08-19T06:59:59.000Z"),
            showcasePublishDate: new Date("2024-08-26T06:59:59.000Z"),
        },
    });
    await prisma.voyage.create({
        data: {
            number: "51",
            status: {
                connect: {
                    name: "Active",
                },
            },
            startDate: new Date("2024-09-04T17:00:00.000Z"),
            endDate: new Date("2024-10-14T04:59:59.000Z"),
            soloProjectDeadline: new Date("2024-08-25T06:59:59.000Z"),
            certificateIssueDate: new Date("2024-10-21T06:59:59.000Z"),
            showcasePublishDate: new Date("2024-10-28T06:59:59.000Z"),
        },
    });
    await prisma.voyage.create({
        data: {
            number: "52",
            status: {
                connect: {
                    name: "Active",
                },
            },
            startDate: new Date("2024-11-04T17:00:00.000Z"),
            endDate: new Date("2024-12-15T04:59:59.000Z"),
            soloProjectDeadline: new Date("2024-10-25T06:59:59.000Z"),
            certificateIssueDate: new Date("2024-12-21T06:59:59.000Z"),
            showcasePublishDate: new Date("2024-12-27T06:59:59.000Z"),
        },
    });
    await prisma.voyage.create({
        data: {
            number: "53",
            status: {
                connect: {
                    name: "Upcoming",
                },
            },
            startDate: new Date("2025-01-06T17:00:00.000Z"),
            endDate: new Date("2025-02-16T04:59:59.000Z"),
            soloProjectDeadline: new Date("2024-10-29T06:59:59.000Z"),
            certificateIssueDate: new Date("2025-02-23T06:59:59.000Z"),
            showcasePublishDate: new Date("2025-03-02T06:59:59.000Z"),
        },
    });
};
