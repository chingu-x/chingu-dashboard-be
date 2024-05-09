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
                            endDate: new Date(
                                addDays(voyage.startDate, 6).setHours(
                                    23,
                                    59,
                                    59,
                                ),
                            ),
                        },
                        {
                            number: 2,
                            startDate: addDays(voyage.startDate, 7),
                            endDate: new Date(
                                addDays(voyage.startDate, 13).setHours(
                                    23,
                                    59,
                                    59,
                                ),
                            ),
                        },
                        {
                            number: 3,
                            startDate: addDays(voyage.startDate, 14),
                            endDate: new Date(
                                addDays(voyage.startDate, 20).setHours(
                                    23,
                                    59,
                                    59,
                                ),
                            ),
                        },
                        {
                            number: 4,
                            startDate: addDays(voyage.startDate, 21),
                            endDate: new Date(
                                addDays(voyage.startDate, 27).setHours(
                                    23,
                                    59,
                                    59,
                                ),
                            ),
                        },
                        {
                            number: 5,
                            startDate: addDays(voyage.startDate, 28),
                            endDate: new Date(
                                addDays(voyage.startDate, 34).setHours(
                                    23,
                                    59,
                                    59,
                                ),
                            ),
                        },
                        {
                            number: 6,
                            startDate: addDays(voyage.startDate, 35),
                            endDate: new Date(
                                addDays(voyage.startDate, 41).setHours(
                                    23,
                                    59,
                                    59,
                                ),
                            ),
                        },
                    ],
                },
            },
        });
    }
};
