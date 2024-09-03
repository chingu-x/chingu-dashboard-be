import { Prisma, PrismaClient } from "@prisma/client";
import { InternalServerErrorException } from "@nestjs/common";

export const prismaExtension = Prisma.defineExtension({
    name: "findUserByOAuthId",
    client: {
        async findUserByOAuthId(providerName: string, providerUserId: string) {
            const context = Prisma.getExtensionContext(this);

            const userInDb = await context.$queryRaw`
                SELECT "UserOAuthProfile".*
                FROM "UserOAuthProfile"
                JOIN "OAuthProvider" ON "UserOAuthProfile"."providerId" = "OAuthProvider"."id"
                WHERE "OAuthProvider".name = ${providerName} AND "UserOAuthProfile"."providerUserId" = ${providerUserId}
            `;

            switch (userInDb.length) {
                case 0:
                    return null;
                case 1:
                    return userInDb[0];
                default:
                    throw new InternalServerErrorException(
                        `Found more than one user with the same OAuthID for ${providerName}`,
                    );
            }
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
