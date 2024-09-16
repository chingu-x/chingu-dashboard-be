import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { DbConfig } from "./dbConfig.interface";
import { dbConfigValidationSchema } from "./dbConfig.schema";

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: dbConfigValidationSchema,
            validationOptions: {
                allowUnknown: true,
                abortEarly: false,
            },
        }),
    ],
    providers: [
        {
            provide: "DB-Config",
            useFactory: (configService: ConfigService): DbConfig => ({
                db: {
                    url: configService.get<string>("DATABASE_URL") as string,
                },
            }),
            inject: [ConfigService],
        },
    ],
    exports: ["DB-Config"],
})
export class DbConfigModule {}
