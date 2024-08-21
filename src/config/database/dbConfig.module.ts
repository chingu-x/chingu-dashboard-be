import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import Joi from "joi";
import databaseConfig from "./database.config";
import { DbConfigService } from "./dbConfig.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [databaseConfig],
            validationSchema: Joi.object({
                dbUrl: Joi.string().required(),
            }),
        }),
    ],
    providers: [DbConfigService],
    exports: [DbConfigService],
})
export class DbConfigModule {}
