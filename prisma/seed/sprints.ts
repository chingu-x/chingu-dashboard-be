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
                                addDays(voyage.startDate, 7).setUTCHours(
                                    4,
                                    59,
                                    59,
                                ),
                            ),
                        },
                        {
                            number: 2,
                            startDate: new Date(
                                addDays(voyage.startDate, 7).setUTCHours(
                                    5,
                                    0,
                                    0,
                                ),
                            ),
                            endDate: new Date(
                                addDays(voyage.startDate, 14).setUTCHours(
                                    4,
                                    59,
                                    59,
                                ),
                            ),
                        },
                        {
                            number: 3,
                            startDate: new Date(
                                addDays(voyage.startDate, 14).setUTCHours(
                                    5,
                                    0,
                                    0,
                                ),
                            ),
                            endDate: new Date(
                                addDays(voyage.startDate, 21).setUTCHours(
                                    4,
                                    59,
                                    59,
                                ),
                            ),
                        },
                        {
                            number: 4,
                            startDate: new Date(
                                addDays(voyage.startDate, 21).setUTCHours(
                                    5,
                                    0,
                                    0,
                                ),
                            ),
                            endDate: new Date(
                                addDays(voyage.startDate, 28).setUTCHours(
                                    4,
                                    59,
                                    59,
                                ),
                            ),
                        },
                        {
                            number: 5,
                            startDate: new Date(
                                addDays(voyage.startDate, 28).setUTCHours(
                                    5,
                                    0,
                                    0,
                                ),
                            ),
                            endDate: new Date(
                                addDays(voyage.startDate, 35).setUTCHours(
                                    4,
                                    59,
                                    59,
                                ),
                            ),
                        },
                        {
                            number: 6,
                            startDate: new Date(
                                addDays(voyage.startDate, 35).setUTCHours(
                                    5,
                                    0,
                                    0,
                                ),
                            ),
                            endDate: new Date(
                                addDays(voyage.startDate, 42).setUTCHours(
                                    4,
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
