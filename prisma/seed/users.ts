import { hashPassword } from "../../src/global/auth/utils";
import { prisma } from "./prisma-client";
import { generateGravatarUrl } from "./utils";

export const getRoleId = (roles, name) => {
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
            avatar: generateGravatarUrl("jessica.williamson@gmail.com"),
            timezone: "Australia/Melbourne",
            countryCode: "AU",
            gender: {
                connect: {
                    abbreviation: "F",
                },
            },
            oAuthProfiles: {
                create: {
                    providerUserId: "1234567",
                    providerUsername: "jessica-discord",
                    provider: {
                        connectOrCreate: {
                            where: {
                                name: "discord",
                            },
                            create: {
                                name: "discord",
                            },
                        },
                    },
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
            avatar: generateGravatarUrl("l.castro@outlook.com"),
            timezone: "America/Chicago",
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
            avatar: generateGravatarUrl("leo.rowe@outlook.com"),
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
            avatar: generateGravatarUrl("JosoMadar@dayrep.com"),
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
            avatar: generateGravatarUrl("dan@random.com"),
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
            avatar: generateGravatarUrl("not_in_voyage@example.com"),
            timezone: "America/New_York",
            comment:
                "This user is not in a voyage - does not have the 'voyager' role",
            countryCode: "US",
        },
    });

    user = await prisma.user.create({
        data: {
            email: "yoshi@gmail.com",
            password: await hashPassword("password"),
            emailVerified: false,
            firstName: "Yoshi",
            lastName: "Amano",
            avatar: generateGravatarUrl("yoshi@gmail.com"),
            timezone: "Australia/Melbourne",
            countryCode: "AU",
            gender: {
                connect: {
                    abbreviation: "M",
                },
            },
        },
    });
    // create two more users

    user = await prisma.user.create({
        data: {
            email: "john@gmail.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "John",
            lastName: "Doe",
            avatar: generateGravatarUrl("john@gmail.com"),
            timezone: "America/New_York",
            countryCode: "US",
            gender: {
                connect: {
                    abbreviation: "M",
                },
            },
        },
    });

    user = await prisma.user.create({
        data: {
            email: "luis@gmail.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Luis",
            lastName: " Garcia",
            avatar: generateGravatarUrl("luis@gmail.com"),
            timezone: "Spain/Madrid",
            countryCode: "ESP",
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
            roleId: getRoleId(roles, "voyager"),
        },
    });
    console.log("Users Populated");
};
