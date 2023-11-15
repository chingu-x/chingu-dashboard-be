import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    Request,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResourcesService } from "./resources.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller()
@ApiTags("team resources")
export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) {}

    @ApiOperation({
        summary:
            "Adds a URL with title to the team's resources, addedBy: teamMemberId (int)",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete("/:resourceId")
    removeResource(
        @Request() req,
        @Param("resourceId", ParseIntPipe) resourceId: number,
    ) {
        return this.resourcesService.removeResource(req, resourceId);
    }
}
