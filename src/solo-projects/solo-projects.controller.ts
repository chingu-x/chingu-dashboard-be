import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from "@nestjs/common";
import { SoloProjectsService } from "./solo-projects.service";
import { CreateSoloProjectDto } from "./dto/create-solo-project.dto";
import { UpdateSoloProjectDto } from "./dto/update-solo-project.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("solo-projects")
@ApiTags("Solo Projects")
export class SoloProjectsController {
    constructor(private readonly soloProjectsService: SoloProjectsService) {}

    @Post()
    create(@Body() createSoloProjectDto: CreateSoloProjectDto) {
        return this.soloProjectsService.create(createSoloProjectDto);
    }

    @ApiOperation({
        summary: "[Permission: admin, evaluator] Get all solo projects",
    })
    @Get()
    @ApiQuery({
        name: "offset",
        type: Number,
        description: "Offset for pagination",
        required: false,
    })
    @ApiQuery({
        name: "pageSize",
        type: Number,
        description: "page size (number of results) for pagination",
        required: false,
    })
    getAllSoloProjects(
        @Query("offset") offset?: number,
        @Query("pageSize") pageSize?: number,
    ) {
        return this.soloProjectsService.getAllSoloProjects(offset, pageSize);
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
