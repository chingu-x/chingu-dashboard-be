import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    providers: [TasksService],
    imports: [PrismaModule],
})
export class TasksModule {}
