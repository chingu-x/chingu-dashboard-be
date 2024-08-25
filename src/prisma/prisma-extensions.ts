import { Prisma, PrismaClient } from "@prisma/client";

export const prismaExtension = Prisma.defineExtension({
    name: "findUserByOAuthId",
    client: {
        async findUserByOAuthId(providerName: string, providerUserId: string) {
            const context = Prisma.getExtensionContext(this);

            return context.$queryRaw`
                SELECT "UserOAuthProfile".*
                FROM "UserOAuthProfile"
                JOIN "OAuthProvider" ON "UserOAuthProfile"."providerId" = "OAuthProvider"."id"
                WHERE "OAuthProvider".name = ${providerName} AND "UserOAuthProfile"."providerUserId" = ${providerUserId}
            `;
        },
    },
});

export const extendedPrismaClient = () => {
    const prisma = new PrismaClient();
    return prisma.$extends(prismaExtension);
};

export const ExtendedPrismaClient = class {
    constructor() {
        return extendedPrismaClient();
    }
} as new () => ReturnType<typeof extendedPrismaClient>;
