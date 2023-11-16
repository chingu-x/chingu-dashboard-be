import { Module } from "@nestjs/common";
import { SprintsService } from "./sprints.service";
import { SprintsController } from "./sprints.controller";
import { FormsModule } from "../forms/forms.module";

@Module({
    controllers: [SprintsController],
    providers: [SprintsService],
    imports: [FormsModule],
})
export class SprintsModule {}
