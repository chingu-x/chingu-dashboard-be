import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../src/utils/auth";

const prisma = new PrismaClient();

export const populateUsers = async () => {
    await prisma.user.create({
        data: {
            email: "jessica.williamson@gmail.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Jessica",
            lastName: "Williamson",
            githubId: "jess-github",
            discordId: "jess-discord",
            twitterId: "jess-twitter",
            linkedinId: "jess-linkedin",
            avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=robohash&r=x",
            timezone: "Australia/Melbourne",
            countryCode: "AU",
            gender: {
                connect: {
                    abbreviation: "F",
                },
            },
        },
    });

    await prisma.user.create({
        data: {
            email: "l.castro@outlook.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Larry",
            lastName: "Castro",
            githubId: "larryc-github",
            discordId: "larryc-discord",
            avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=monsterid&r=x",
            timezone: "America/Los_Angeles",
            comment: "Member seems to be inactive",
            countryCode: "US",
            gender: {
                connect: {
                    abbreviation: "M",
                },
            },
        },
    });

    await prisma.user.create({
        data: {
            email: "leo.rowe@outlook.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Leonarda",
            lastName: "Rowe",
            githubId: "leo-github",
            discordId: "leo-discord",
            avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=identicon&r=x",
            timezone: "America/Los_Angeles",
            comment: "This is a random admin comment",
            countryCode: "US",
            gender: {
                connect: {
                    abbreviation: "NB",
                },
            },
        },
    });

    await prisma.user.create({
        data: {
            email: "JosoMadar@dayrep.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Joso",
            lastName: "Mađar",
            githubId: "joso-github",
            discordId: "joso-discord",
            avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=wavatar&r=x",
            timezone: "Europe/Zagreb",
            comment: "This is a random admin comment",
            countryCode: "HR",
        },
    });

    console.log("Users Populated");
};
