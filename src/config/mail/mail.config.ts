import { registerAs } from "@nestjs/config";

export default registerAs("mail", () => ({
    mailjetApiPublic: process.env.MJ_APIKEY_PUBLIC,
    mailjetApiPrivate: process.env.MJ_APIKEY_PRIVATE,
    frontendUrl: process.env.FRONTEND_URL,
}));
