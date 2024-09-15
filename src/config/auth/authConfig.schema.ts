import * as Joi from "joi";

export const authValidationSchema = Joi.object({
    secrets: Joi.object({
        JWT_SECRET: Joi.string().required(),
        AT_SECRET: Joi.string().required(),
        RT_SECRET: Joi.string().required(),
    }),
    bcrypt: Joi.object({
        hashingRounds: Joi.number().required(),
    }),
});
