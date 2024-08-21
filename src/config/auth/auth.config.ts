import { registerAs } from "@nestjs/config";

export default registerAs("auth", () => ({
    secrets: {
        jwt: process.env.JWT_SECRET,
        at: process.env.AT_SECRET,
        rt: process.env.RT_SECRET,
    },
    bcrypt: {
        hashingRounds: process.env.BCRYPT_HASHING_ROUNDS,
    },
    social: {
        discord: {
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DISCORD_CALLBACK_URL,
        },
    },
}));
