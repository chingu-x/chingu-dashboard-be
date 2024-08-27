import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
}));
