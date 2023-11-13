import { Module } from "@nestjs/common";
import { FeaturesService } from "./features.service";
import { FeaturesController } from "./features.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    controllers: [FeaturesController],
    providers: [FeaturesService],
    imports: [PrismaModule],
})
export class FeaturesModule {}
