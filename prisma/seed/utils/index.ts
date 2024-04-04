import { prisma } from "../prisma-client";

export const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

export const getSprintId = async (teamVoyageId, sprintNumber) => {
    const sprint = await prisma.sprint.findUnique({
        where: {
            voyageSprintNumber: {
                voyageId: teamVoyageId,
                number: sprintNumber,
            },
        },
    });
    return sprint.id;
};

export const getRandomDateDuringSprint = async (sprintId) => {
    const sprint = await prisma.sprint.findUnique({
        where: {
            id: sprintId,
        },
    });
    return addDays(sprint.startDate, Math.floor(Math.random() * 6));
};
