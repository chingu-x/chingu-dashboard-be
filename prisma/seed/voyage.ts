import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const populateVoyages = async () => {
    await prisma.voyage.create({
        data: {
            number: "47",
            status: {
                connect: {
                    name: "Active",
                },
            },
            startDate: new Date("2024-01-08"),
            endDate: new Date("2024-02-18"),
            soloProjectDeadline: new Date("2023-12-31"),
            certificateIssueDate: new Date("2024-02-25"),
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
            endDate: new Date("2024-04-14"),
            soloProjectDeadline: new Date("2024-02-25"),
            certificateIssueDate: new Date("2024-04-21"),
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
            endDate: new Date("2024-06-16"),
            soloProjectDeadline: new Date("2024-04-28"),
            certificateIssueDate: new Date("2024-06-23"),
        },
    });
};
