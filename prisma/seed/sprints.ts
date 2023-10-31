import {PrismaClient} from "@prisma/client";
import {addDays} from "./utils";
const prisma = new PrismaClient();

export const populateSprints = async () => {
    const voyages = await prisma.voyage.findMany({});
    await prisma.voyage.update({
        where: {
            id: voyages[0].id
        },
        data: {
            sprints: {
                create: [
                    {
                        number: 1,
                        startDate: voyages[0].startDate,
                        endDate: addDays(voyages[0].startDate, 6),
                    },
                    {
                        number: 2,
                        startDate: addDays(voyages[0].startDate, 7),
                        endDate: addDays(voyages[0].startDate, 13),
                    },
                    {
                        number: 3,
                        startDate: addDays(voyages[0].startDate, 14),
                        endDate: addDays(voyages[0].startDate, 20),
                    },
                    {
                        number: 4,
                        startDate: addDays(voyages[0].startDate, 21),
                        endDate: addDays(voyages[0].startDate, 27),
                    },
                    {
                        number: 5,
                        startDate: addDays(voyages[0].startDate, 28),
                        endDate: addDays(voyages[0].startDate, 34),
                    },
                    {
                        number: 6,
                        startDate: addDays(voyages[0].startDate, 35),
                        endDate: addDays(voyages[0].startDate, 41),
                    },
                ]
            }
        }
    })

    await prisma.voyage.update({
        where: {
            id: voyages[1].id
        },
        data: {
            sprints: {
                create: [
                    {
                        number: 1,
                        startDate: voyages[1].startDate,
                        endDate: addDays(voyages[1].startDate, 6),
                    },
                    {
                        number: 2,
                        startDate: addDays(voyages[1].startDate, 7),
                        endDate: addDays(voyages[1].startDate, 13),
                    },
                    {
                        number: 3,
                        startDate: addDays(voyages[1].startDate, 14),
                        endDate: addDays(voyages[1].startDate, 20),
                    },
                    {
                        number: 4,
                        startDate: addDays(voyages[1].startDate, 21),
                        endDate: addDays(voyages[1].startDate, 27),
                    },
                    {
                        number: 5,
                        startDate: addDays(voyages[1].startDate, 28),
                        endDate: addDays(voyages[1].startDate, 34),
                    },
                    {
                        number: 6,
                        startDate: addDays(voyages[1].startDate, 35),
                        endDate: addDays(voyages[1].startDate, 41),
                    },
                ]
            }
        }
    })
}