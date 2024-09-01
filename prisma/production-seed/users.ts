import { prisma } from "../seed/prisma-client";
import { hashPassword } from "../../src/utils/auth";
import { getRoleId } from "../seed/users";
import { generateGravatarUrl } from "../seed/utils";

export const populateUsersProd = async () => {
    const roles = await prisma.role.findMany({});

    //<editor-fold desc="admin account">
    const adminUser = await prisma.user.create({
        data: {
            email: "admin@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Admin",
            lastName: "Surname",
            avatar: generateGravatarUrl("admin@example.com"),
            timezone: "US/Central",
            countryCode: "US",
        },
    });
    await prisma.userRole.create({
        data: {
            userId: adminUser.id,
            roleId: getRoleId(roles, "admin"),
        },
    });
    //</editor-fold>

    //<editor-fold desc="PO Team">
    let user = await prisma.user.create({
        data: {
            email: "jim@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Jim",
            lastName: "PO",
            avatar: generateGravatarUrl("jim@example.com"),
            timezone: "US/Central",
            countryCode: "US",
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
            email: "razieh@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Razieh",
            lastName: "PO",
            avatar: generateGravatarUrl("razieh@example.com"),
            timezone: "Europe/Madrid",
            countryCode: "ES",
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
            email: "mladen@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Mladen",
            lastName: "PO",
            avatar: generateGravatarUrl("mladen@example.com"),
            timezone: "Europe/Madrid",
            countryCode: "ES",
        },
    });

    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: getRoleId(roles, "voyager"),
        },
    });
    //</editor-fold>

    //<editor-fold desc="Design Team">
    user = await prisma.user.create({
        data: {
            email: "eury@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Eury",
            lastName: "Design",
            avatar: generateGravatarUrl("eury@example.com"),
            timezone: "US/Central",
            countryCode: "US",
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
            email: "joe@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Joe",
            lastName: "Design",
            avatar: generateGravatarUrl("joe@example.com"),
            timezone: "US/Central",
            countryCode: "US",
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
            email: "joseph@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Joseph",
            lastName: "Design",
            avatar: generateGravatarUrl("joseph@example.com"),
            timezone: "America/Lima",
            countryCode: "PE",
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
            email: "austin@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Austin",
            lastName: "Design",
            avatar: generateGravatarUrl("austin@example.com"),
            timezone: "US/Pacific",
            countryCode: "US",
        },
    });

    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: getRoleId(roles, "voyager"),
        },
    });
    //</editor-fold>

    //<editor-fold desc="Frontend Team">
    user = await prisma.user.create({
        data: {
            email: "dan@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Dan",
            lastName: "Frontend",
            avatar: generateGravatarUrl("dan@example.com"),
            timezone: "US/Eastern",
            countryCode: "US",
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
            email: "jane@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Jane",
            lastName: "Frontend",
            avatar: generateGravatarUrl("jane@example.com"),
            timezone: "Asia/Tbilisi",
            countryCode: "GE",
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
            email: "timothy@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Timothy",
            lastName: "Frontend",
            avatar: generateGravatarUrl("timothy@example.com"),
            timezone: "Europe/Rome",
            countryCode: "IT",
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
            email: "winnie@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Winnie",
            lastName: "Frontend",
            avatar: generateGravatarUrl("winnie@example.com"),
            timezone: "US/Central",
            countryCode: "US",
        },
    });

    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: getRoleId(roles, "voyager"),
        },
    });
    //</editor-fold>

    //<editor-fold desc="Backend Team">
    user = await prisma.user.create({
        data: {
            email: "cheryl@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Cheryl",
            lastName: "Backend",
            avatar: generateGravatarUrl("cheryl@example.com"),
            timezone: "Australia/Melbourne",
            countryCode: "AU",
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
            email: "curt@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Curt",
            lastName: "Backend",
            avatar: generateGravatarUrl("curt@example.com"),
            timezone: "US/Central",
            countryCode: "US",
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
            email: "josh@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Josh",
            lastName: "Backend",
            avatar: generateGravatarUrl("josh@example.com"),
            timezone: "US/Pacific",
            countryCode: "US",
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
            email: "tim@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Tim",
            lastName: "Backend",
            avatar: generateGravatarUrl("tim@example.com"),
            timezone: "US/Central",
            countryCode: "US",
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
            email: "arman@example.com",
            password: await hashPassword("password"),
            emailVerified: true,
            firstName: "Arman",
            lastName: "Backend",
            avatar: generateGravatarUrl("arman@example.com"),
            timezone: "Asia/Kolkata",
            countryCode: "IN",
        },
    });

    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: getRoleId(roles, "voyager"),
        },
    });
    //</editor-fold>

    console.log("[Prod] Users populated.");
};
