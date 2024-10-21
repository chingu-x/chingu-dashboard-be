import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from "@nestjs/common";
import { SoloProjectsService } from "./solo-projects.service";
import { CreateSoloProjectDto } from "./dto/create-solo-project.dto";
import { UpdateSoloProjectDto } from "./dto/update-solo-project.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("solo-projects")
@ApiTags("Solo Projects")
export class SoloProjectsController {
    constructor(private readonly soloProjectsService: SoloProjectsService) {}

    @Post()
    create(@Body() createSoloProjectDto: CreateSoloProjectDto) {
        return this.soloProjectsService.create(createSoloProjectDto);
    }

    @Get()
    findAll() {
        return this.soloProjectsService.getAllSoloProjects();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.soloProjectsService.findOne(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateSoloProjectDto: UpdateSoloProjectDto,
    ) {
        return this.soloProjectsService.update(+id, updateSoloProjectDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.soloProjectsService.remove(+id);
    }
}
