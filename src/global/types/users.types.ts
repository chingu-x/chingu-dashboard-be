import { Prisma } from "@prisma/client";

export type UserWithProfile = Prisma.UserGetPayload<{
    include: {
        oAuthProfiles: {
            select: {
                provider: true;
                providerId: true;
                providerUsername: true;
            };
        };
    };
}>;
