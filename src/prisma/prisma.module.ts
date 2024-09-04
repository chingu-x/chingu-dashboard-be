import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { DbConfig } from "../config/database/dbConfig.interface";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        PrismaService,
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
    exports: [PrismaService],
})
export class PrismaModule {}
