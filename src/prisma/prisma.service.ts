import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { ExtendedPrismaClient } from "./prisma-extensions";
import { DbConfig } from "@/config/database/dbConfig.interface";
import { PrismaClient } from "@prisma/client";
@Injectable()
export class PrismaService
    extends ExtendedPrismaClient
    implements OnModuleInit
{
    private prisma: PrismaClient;
    constructor(@Inject("DB-Config") private config: DbConfig) {
        super();
        this.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: this.config.db.url,
                },
            },
            log: ["query", "info", "warn", "error"],
        });
    }
    async onModuleInit() {
        await this.$connect();
    }
}
