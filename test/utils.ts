import { PrismaClient } from "@prisma/client";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

const prisma = new PrismaClient();

// returns just the token
export const extractResCookieValueByKey = (cookies, key) => {
    return cookies
        .map((cookie) => {
            return cookie.split(";")[0].split("=");
        })
        .filter((cookie) => cookie[0] === key)[0][1];
};

// returns 'access_token={token}; Max-Age=1800; Path=/; Expires=Fri, 16 Feb 2024 03:17:25 GMT; HttpOnly; Secure'
export const extractCookieByKey = (cookie, key) => {
    return cookie.filter((cookie) => cookie.includes(key))[0];
};

export const loginAndGetTokens = async (
    email: string,
    password: string,
    app: INestApplication,
) => {
    const r = await request(app.getHttpServer()).post("/auth/login").send({
        email,
        password,
    });

    const access_token = extractCookieByKey(
        r.headers["set-cookie"],
        "access_token",
    );
    const refresh_token = extractCookieByKey(
        r.headers["set-cookie"],
        "refresh_token",
    );

    return { access_token, refresh_token };
};

export const getNonAdminUser = async () => {
    try {
        const adminRole = await prisma.role.findUnique({
            where: {
                name: "admin",
            },
        });
        return prisma.user.findFirst({
            where: {
                roles: {
                    none: {
                        roleId: adminRole.id,
                    },
                },
            },
        });
    } catch (e) {
        console.log(e);
    } finally {
        await prisma.$disconnect();
    }
};
