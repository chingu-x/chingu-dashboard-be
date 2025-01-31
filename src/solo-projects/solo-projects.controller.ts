import { Controller, Get, Query, HttpStatus } from "@nestjs/common";
import { SoloProjectsService } from "./solo-projects.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SoloProjectsResponse } from "@/solo-projects/solo-projects.response";
import {
    BadRequestErrorResponse,
    ForbiddenErrorResponse,
    UnauthorizedErrorResponse,
} from "@/global/responses/errors";
import { GetSoloProjectDto } from "@/solo-projects/dto/get-solo-project.dto";

@Controller("solo-projects")
@ApiTags("Solo Projects")
export class SoloProjectsController {
    constructor(private readonly soloProjectsService: SoloProjectsService) {}

    @ApiOperation({
        summary: "[Permission: admin, evaluator] Get all solo projects",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            "Successfully gets all solo projects based on query params",
        isArray: true,
        type: SoloProjectsResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid input/query params",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized access: user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "Forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @Get()
    getAllSoloProjects(@Query() query: GetSoloProjectDto) {
        return this.soloProjectsService.getAllSoloProjects(
            query.offset,
            query.pageSize,
            query.sort,
        );
    }
}
