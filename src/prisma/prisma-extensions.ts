import { Prisma, PrismaClient } from "@prisma/client";

export const findUserByOAuthId = Prisma.defineExtension({
    name: "findUserByOAuthId",
    model: {
        userOAuthProfile: {
            async findUserByOAuthId(
                providerName: string,
                providerUserId: string,
            ) {
                const context = Prisma.getExtensionContext(this);
                return context.$queryRaw`
                            SELECT userOAuthProfile.*
                            FROM userOAuthProfile
                            JOIN oAuthProviders ON userOAuthProfile.providerId = oAuthProviders.id
                            WHERE oAuthProviders.name = ${providerName} AND userOAuthProfile.providerUserId = ${providerUserId}
                        `;
            },
        },
    },
});

export const extendedPrismaClient = (prismaClient: PrismaClient) => {
    return prismaClient.$extends(findUserByOAuthId);
};

export const ExtendedPrismaClient = class {
    constructor() {
        return extendedPrismaClient;
    }
} as new () => ReturnType<typeof extendedPrismaClient>;
