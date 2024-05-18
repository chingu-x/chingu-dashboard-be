import { hashPassword } from "../../src/utils/auth";
import { prisma } from "./prisma-client";

const getRoleId = (roles, name) => {
    return roles.filter((role) => role.name == name)[0].id;
};

export const populateUsers = async () => {
    const roles = await prisma.role.findMany({});

    let user = await prisma.user.create({
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

    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: getRoleId(roles, "voyager"),
        },
    });

    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: getRoleId(roles, "admin"),
        },
    });

    user = await prisma.user.create({
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

    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: getRoleId(roles, "admin"),
        },
    });

    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: getRoleId(roles, "voyager"),
        },
    });

    user = await prisma.user.create({
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

    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: getRoleId(roles, "voyager"),
        },
    });

    user = await prisma.user.create({
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

    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: getRoleId(roles, "voyager"),
        },
    });

    user = await prisma.user.create({
        data: {
            email: "dan@random.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Dan",
            lastName: "Ko",
            avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=wavatar&r=x",
            timezone: "America/Los_Angeles",
            comment: "No comment",
            countryCode: "US",
        },
    });

    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: getRoleId(roles, "voyager"),
        },
    });

    await prisma.user.create({
        data: {
            email: "not_in_voyage@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Not in a voyage",
            lastName: "Voyage",
            avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=wavatar&r=x",
            timezone: "America/Los_Angeles",
            comment:
                "This user is not in a voyage - does not have the 'voyager' role",
            countryCode: "US",
        },
    });

    console.log("Users Populated");
};
