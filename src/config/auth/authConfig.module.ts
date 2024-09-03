import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { authValidationSchema } from "./authConfig.schema";
import { AuthConfig } from "./auth.interface";

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: authValidationSchema,
            validationOptions: {
                allowUnknown: true,
                abortEarly: false,
            },
        }),
    ],
    providers: [
        {
            provide: "Auth-Config",
            useFactory: (configService: ConfigService): AuthConfig => ({
                secrets: {
                    JWT_SECRET: configService.get<string>(
                        "JWT_SECRET",
                    ) as string,
                    AT_SECRET: configService.get<string>("AT_SECRET") as string,
                    RT_SECRET: configService.get<string>("RT_SECRET") as string,
                },
                bcrypt: {
                    hashingRounds: configService.get<number>(
                        "BCRYPT_HASHING_ROUNDS",
                    ) as number,
                },
            }),
            inject: [ConfigService],
        },
    ],
    exports: ["Auth-Config"],
})
export class AuthConfigModule {}
