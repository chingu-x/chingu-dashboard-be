import { registerAs } from "@nestjs/config";

export default registerAs("auth", () => ({
    secrets: {
        jwt: process.env.JWT_SECRET as string,
        at: process.env.AT_SECRET as string,
        rt: process.env.RT_SECRET as string,
    },
    bcrypt: {
        hashingRounds: process.env.BCRYPT_HASHING_ROUNDS as string,
    },
    social: {
        discord: {
            clientID: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            callbackURL: process.env.DISCORD_CALLBACK_URL as string,
        },
        // Add other social types here as needed
        // e.g., facebook: {
        //         clientID: process.env.FACEBOOK_CLIENT_ID as string,
        //         clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        //         callbackURL: process.env.FACEBOOK_CALLBACK_URL as string,
        //     },
        //     twitter: {
        //         clientID: process.env.TWITTER_CLIENT_ID as string,
        //         clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
        //         callbackURL: process.env.TWITTER_CALLBACK_URL as string,
        //     },
    },
}));
