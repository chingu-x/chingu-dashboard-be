import { AuthConfig } from "src/config/auth/auth.interface";

export const config: AuthConfig = {
    secrets: {
        JWT_SECRET: process.env.JWT_SECRET ?? "",
        AT_SECRET: process.env.AT_SECRET ?? "",
        RT_SECRET: process.env.RT_SECRET ?? "",
    },
    bcrypt: {
        hashingRounds: parseInt(process.env.BCRYPT_HASHING_ROUNDS ?? "10", 10),
    },
};
