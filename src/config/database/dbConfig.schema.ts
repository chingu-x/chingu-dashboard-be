import * as Joi from "joi";

export const dbConfigValidationSchema = Joi.object({
    db: Joi.object({
        url: Joi.string().required(),
    }),
});
