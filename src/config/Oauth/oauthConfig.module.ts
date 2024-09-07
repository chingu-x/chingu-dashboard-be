import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { oauthValidationSchema } from "./oauthConfig.schema";
import { OAuthConfig } from "./oauthConfig.interface";

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: oauthValidationSchema,
            validationOptions: {
                allowUnknown: true,
                abortEarly: false,
            },
        }),
    ],
    providers: [
        {
            provide: "OAuth-Config",
            useFactory: (configService: ConfigService): OAuthConfig => ({
                discord: {
                    clientId: configService.get<string>(
                        "DISCORD_CLIENT_ID",
                    ) as string,
                    clientSecret: configService.get<string>(
                        "DISCORD_CLIENT_SECRET",
                    ) as string,
                    callbackUrl: configService.get<string>(
                        "DISCORD_CALLBACK_URL",
                    ) as string,
                },
                // Add other OAuth providers as needed
            }),
            inject: [ConfigService],
        },
    ],
    exports: ["OAuth-Config"],
})
export class OAuthConfigModule {}
