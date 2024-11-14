import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpStatus,
} from "@nestjs/common";
import { SoloProjectsService } from "./solo-projects.service";
import { CreateSoloProjectDto } from "./dto/create-solo-project.dto";
import { UpdateSoloProjectDto } from "./dto/update-solo-project.dto";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IntDefaultValuePipe } from "@/pipes/int-default-value-pipe";
import { SoloProjectsResponse } from "@/solo-projects/solo-projects.response";

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
        description: "Offset for pagination (default: 0)",
        required: false,
    })
    @ApiQuery({
        name: "pageSize",
        type: Number,
        description:
            "page size (number of results) for pagination (default: 30)",
        required: false,
    })
    @ApiQuery({
        name: "sort",
        type: String,
        description:
            "Sort. - for descending, + (or nothing) for ascending (default: -createdAt)" +
            "<br/> Example: '+status;-createdAt' will sort by status ascending then createdAt descending" +
            "<br/> Valid sort fields are: 'status', 'createdAt', 'updatedAt'",
        required: false,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            "Successfully gets all solo projects based on query params",
        isArray: true,
        type: SoloProjectsResponse,
    })
    getAllSoloProjects(
        @Query("offset", new IntDefaultValuePipe(0)) offset: number,
        @Query("pageSize", new IntDefaultValuePipe(30)) pageSize: number,
        @Query("sort") sort: string,
    ) {
        return this.soloProjectsService.getAllSoloProjects(
            offset,
            pageSize,
            sort,
        );
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
