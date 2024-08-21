import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
    dbUrl: process.env.DATABASE_URL,
}));
