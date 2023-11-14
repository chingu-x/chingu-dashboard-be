import { Module, Global } from "@nestjs/common";
import { GlobalService } from "./global.service";
import { PrismaModule } from "../prisma/prisma.module";

@Global()
@Module({
    providers: [GlobalService],
    exports: [GlobalService],
    imports: [PrismaModule],
})
export class GlobalModule {}
