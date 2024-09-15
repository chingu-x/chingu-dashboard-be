import * as Joi from "joi";

export const oauthValidationSchema = Joi.object({
    DISCORD_CLIENT_ID: Joi.string().required(),
    DISCORD_CLIENT_SECRET: Joi.string().required(),
    DISCORD_CALLBACK_URL: Joi.string().required(),
    // Add other OAuth providers as needed
});
