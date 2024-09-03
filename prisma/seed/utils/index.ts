import { prisma } from "../prisma-client";
import * as crypto from "crypto";

export const addDays = (date, days: number) => {
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
    return sprint?.id;
};

export const getRandomDateDuringSprint = async (sprintId) => {
    const sprint = await prisma.sprint.findUnique({
        where: {
            id: sprintId,
        },
    });
    return addDays(sprint?.startDate, Math.floor(Math.random() * 6));
};

export const generateGravatarUrl = (email: string = "noemail@example.com") => {
    const themes = ["identicon", "monsterid", "wavatar", "retro", "robohash"];
    const hash = crypto.createHash("sha256").update(email).digest("hex");
    return `https://gravatar.com/avatar/${hash}?s=200&r=g&d=${themes[Math.floor(Math.random() * themes.length)]}
`;
};
