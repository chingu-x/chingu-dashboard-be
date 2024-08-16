import { prisma } from "../seed/prisma-client";

export const populateVoyagesProd = async () => {
    await prisma.voyage.create({
        data: {
            number: "52",
            status: {
                connect: {
                    name: "Active",
                },
            },
            startDate: new Date("2024-08-19T17:00:00.000Z"),
            endDate: new Date("2024-09-29T04:59:59.000Z"),
            soloProjectDeadline: new Date("2024-08-13T06:59:59.000Z"),
            certificateIssueDate: new Date("2024-10-07T06:59:59.000Z"),
        },
    });
    console.log("[Prod] voyages populated");
};
