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
    Request
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResourcesService } from "./resources.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { DeleteResourceDto } from "./dto/delete-resource.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller()
@ApiTags("team resources")
export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) {}

    @ApiOperation({
        description:
            "Adds a URL with title to the team's resources, addedBy: teamMemberId (int)",
    })
    @Post("/teams/:teamId/resources")
    createNewResource(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body() createResourceDto: CreateResourceDto,
    ) {
        return this.resourcesService.createNewResource(
            createResourceDto,
            teamId,
        );
    }

    @ApiOperation({
        description: "Gets all resources added by a team given a teamId (int)",
    })
    @Get("/teams/:teamId/resources")
    findAllResources(@Param("teamId", ParseIntPipe) teamId: number) {
        return this.resourcesService.findAllResources(teamId);
    }

    @ApiOperation({
        description:
            "Edit URL/title for a resource if teamMemberId (int) matches logged in user",
    })
    @Patch("/teams/:teamId/resources/:resourceId")
    updateResource(
        @Param("resourceId", ParseIntPipe) resourceId: number,
        @Body() updateResourceDto: UpdateResourceDto,
    ) {
        return this.resourcesService.updateResource(
            resourceId,
            updateResourceDto,
        );
    }

    @ApiOperation({
        description:
            "Delete a resource if teamMemberId (int) matches logged in user",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete("/teams/:teamId/resources/:resourceId")
    removeResource(
        @Request() req,
        @Param("resourceId", ParseIntPipe) resourceId: number,
        @Body() deleteResourceDto: DeleteResourceDto,
    ) {
        return this.resourcesService.removeResource(
            resourceId,
            deleteResourceDto,
        );
    }
}
