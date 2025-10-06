import { prisma } from "../seed/prisma-client";

export const populateVoyagesProd = async () => {
    await prisma.voyage.create({
        data: {
            number: "999",
            status: {
                connect: {
                    name: "Active",
                },
            },
            startDate: new Date("2025-09-29T17:00:00.000Z"),
            endDate: new Date("2025-11-10T04:59:59.000Z"),
            soloProjectDeadline: new Date("2025-09-23T06:59:59.000Z"),
            certificateIssueDate: new Date("2025-11-18T06:59:59.000Z"),
        },
    });
    console.log("[Prod] voyages populated");
};
