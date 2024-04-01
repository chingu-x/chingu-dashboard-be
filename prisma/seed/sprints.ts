import { addDays } from "./utils";
import { prisma } from "./prisma-client";

export const populateSprints = async () => {
    const voyages = await prisma.voyage.findMany({});

    for (const voyage of voyages) {
        await prisma.voyage.update({
            where: {
                id: voyage.id,
            },
            data: {
                sprints: {
                    create: [
                        {
                            number: 1,
                            startDate: voyage.startDate,
                            endDate: addDays(voyage.startDate, 6),
                        },
                        {
                            number: 2,
                            startDate: addDays(voyage.startDate, 7),
                            endDate: addDays(voyage.startDate, 13),
                        },
                        {
                            number: 3,
                            startDate: addDays(voyage.startDate, 14),
                            endDate: addDays(voyage.startDate, 20),
                        },
                        {
                            number: 4,
                            startDate: addDays(voyage.startDate, 21),
                            endDate: addDays(voyage.startDate, 27),
                        },
                        {
                            number: 5,
                            startDate: addDays(voyage.startDate, 28),
                            endDate: addDays(voyage.startDate, 34),
                        },
                        {
                            number: 6,
                            startDate: addDays(voyage.startDate, 35),
                            endDate: addDays(voyage.startDate, 41),
                        },
                    ],
                },
            },
        });
    }
};
