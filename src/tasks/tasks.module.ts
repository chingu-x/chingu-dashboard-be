import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
    providers: [TasksService],
    imports: [PrismaModule],
})
export class TasksModule {}
