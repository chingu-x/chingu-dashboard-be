import * as Joi from "joi";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./app.config";
import { AppConfigService } from "./appConfig.service";
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig],
            validationSchema: Joi.object({
                nodeEnv: Joi.string()
                    .valid("development", "production", "test")
                    .default("development"),
                port: Joi.number().port(),
                frontendUrl: Joi.string(),
            }),
        }),
    ],
    providers: [AppConfigService],
    exports: [AppConfigService],
})
export class AppConfigModule {}
