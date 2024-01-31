import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Request,
    HttpStatus,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResourcesService } from "./resources.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import {
    BadRequestErrorResponse,
    NotFoundErrorResponse,
    UnauthorizedErrorResponse,
    BadRequestErrorArrayResponse,
} from "../global/responses/errors";
import {
    TeamResourceAddedByResponse,
    TeamResourceResponse,
} from "./resources.response";

@Controller()
@ApiTags("Voyage - Resources")
export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) {}

    @ApiOperation({
        summary:
            "Adds a URL with title to the team's resources, addedBy: teamMemberId (int)",
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The resource has been created successfully.",
        type: TeamResourceResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid teamId",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad Request - Invalid or missing URL/title",
        type: BadRequestErrorArrayResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "User is unauthorized to perform this action",
        type: UnauthorizedErrorResponse,
    })
    @ApiParam({
        name: "teamId",
        required: true,
        description: "Voyage team ID",
        example: 1,
    })
    @Post()
    createNewResource(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body() createResourceDto: CreateResourceDto,
    ) {
        return this.resourcesService.createNewResource(
            req,
            createResourceDto,
            teamId,
        );
    }

    @ApiOperation({
        summary: "Gets all resources added by a team given a teamId (int)",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Returns all the resources for a particular team",
        isArray: true,
        type: TeamResourceAddedByResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid teamId",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "User is unauthorized to perform this action",
        type: UnauthorizedErrorResponse,
    })
    @ApiParam({
        name: "teamId",
        required: true,
        description: "Voyage team ID",
        example: 1,
    })
    @Get()
    findAllResources(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
    ) {
        return this.resourcesService.findAllResources(req, teamId);
    }

    @ApiOperation({
        summary:
            "Edit URL/title for a resource if teamMemberId (int) matches logged in user",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Resource was successfully updated",
        type: TeamResourceResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "User is unauthorized to perform this action",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad Request - Resource couldn't be updated",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid resourceId",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "resourceId",
        required: true,
        description: "Team resource ID",
        example: 1,
    })
    @Patch("/:resourceId")
    updateResource(
        @Request() req,
        @Param("resourceId", ParseIntPipe) resourceId: number,
        @Body() updateResourceDto: UpdateResourceDto,
    ) {
        return this.resourcesService.updateResource(
            req,
            resourceId,
            updateResourceDto,
        );
    }

    @ApiOperation({
        summary:
            "Delete a resource if teamMemberId (int) matches logged in user",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Resource was successfully deleted",
        type: TeamResourceResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "User is unauthorized to perform this action",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad Request - Resource couldn't be deleted",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid resourceId",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "resourceId",
        required: true,
        description: "Team resource ID",
        example: 1,
    })
    @Delete("/:resourceId")
    removeResource(
        @Request() req,
        @Param("resourceId", ParseIntPipe) resourceId: number,
    ) {
        return this.resourcesService.removeResource(req, resourceId);
    }
}
