import * as Joi from "joi";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import authConfig from "./auth.config";
import { AuthConfigService } from "./authConfig.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [authConfig],
            validationSchema: Joi.object({
                secrets: Joi.object({
                    jwt: Joi.string().required(),
                    at: Joi.string().required(),
                    rt: Joi.string().required(),
                }),
                bcrypt: Joi.object({
                    hashingRounds: Joi.number().required(),
                }),
                social: Joi.object({
                    discord: Joi.object({
                        clientID: Joi.string().required(),
                        clientSecret: Joi.string().required(),
                        callbackURL: Joi.string().required(),
                    }),
                }),
            }),
        }),
    ],
    providers: [AuthConfigService],
    exports: [AuthConfigService],
})
export class AuthConfigModule {}
