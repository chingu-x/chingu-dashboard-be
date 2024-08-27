import * as Joi from "joi";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import mailConfig from "./mail.config";
import { MailConfigService } from "./mailConfig.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [mailConfig],
            validationSchema: Joi.object({
                mailjetApiPublic: Joi.string(),
                mailjetApiPrivate: Joi.string(),
                frontendUrl: Joi.string(),
            }),
        }),
    ],
    providers: [MailConfigService],
    exports: [MailConfigService],
})
export class MailConfigModule {}
