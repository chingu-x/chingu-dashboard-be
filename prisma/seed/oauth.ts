import { prisma } from "./prisma-client";

const populateOAuthProviders = async () => {
    await prisma.oAuthProvider.createMany({
        data: [
            {
                name: "discord",
            },
            {
                name: "github",
            },
        ],
    });
};

const populateOAuthUserProfiles = async () => {};

export const populateOAuth = async () => {
    await populateOAuthProviders();
    await populateOAuthUserProfiles();
};

console.log("OAuth Providers and userProfile populated");
