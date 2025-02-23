import * as Joi from "joi";
import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./app.config";
import { AppConfigService } from "./appConfig.service";

@Global()
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
