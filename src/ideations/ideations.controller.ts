import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Request,
} from "@nestjs/common";
import { IdeationsService } from "./ideations.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
    BadRequestErrorResponse,
    ConflictErrorResponse,
    NotFoundErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";
import {
    IdeationResponse,
    IdeationVoteResponse,
    TeamIdeationsResponse,
} from "./ideations.response";
import { AppPermissions } from "../auth/auth.permissions";
import { Permissions } from "../global/decorators/permissions.decorator";
import { CustomRequest } from "../global/types/CustomRequest";
import { Roles } from "../global/decorators/roles.decorator";
import { AppRoles } from "../auth/auth.roles";

@Controller()
@ApiTags("Voyage - Ideations")
export class IdeationsController {
    constructor(private readonly ideationsService: IdeationsService) {}

    @ApiOperation({
        summary:
            "Adds a new ideation to the team, add the creator as first voter.",
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            "Invalid uuid or teamID. User is not authorized to perform this action.",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description:
            "Ideation vote cannot be added, ideation ID from created ideation does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Successfully created a new ideation and vote added.",
        type: IdeationResponse,
    })
    @Permissions(AppPermissions.OWN_TEAM)
    @Post()
    createIdeation(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body() createIdeationDto: CreateIdeationDto,
    ) {
        return this.ideationsService.createIdeation(
            req,
            teamId,
            createIdeationDto,
        );
    }

    @ApiOperation({
        summary:
            "Adds an ideation vote given a ideationId (int) and teamId (int).",
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            "Invalid uuid or teamID. User is not authorized to perform this action.",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Ideation with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: "User has already voted for ideation.",
        type: ConflictErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Successfully created a new ideation vote.",
        type: IdeationVoteResponse,
    })
    @Permissions(AppPermissions.OWN_TEAM)
    @Post("/:ideationId/ideation-votes")
    createIdeationVote(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("ideationId", ParseIntPipe) ideationId: number,
    ) {
        return this.ideationsService.createIdeationVote(
            req,
            teamId,
            ideationId,
        );
    }

    @ApiOperation({
        summary: "Gets all ideations for a team given a teamId (int).",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Voyage Team with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully got ideations for given team.",
        isArray: true,
        type: TeamIdeationsResponse,
    })
    @Permissions(AppPermissions.OWN_TEAM)
    @Get()
    getIdeationsByVoyageTeam(@Param("teamId", ParseIntPipe) teamId: number) {
        return this.ideationsService.getIdeationsByVoyageTeam(teamId);
    }

    @ApiOperation({
        summary:
            "Updates an ideation given a ideationId (int) and the that user that created it is logged in.",
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            "Invalid uuid or teamID. User is not authorized to perform this action.",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Ideation with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully updated ideation.",
        type: IdeationResponse,
    })
    @Permissions(AppPermissions.OWN_TEAM)
    @Patch("/:ideationId")
    updateIdeation(
        @Request() req: CustomRequest,
        @Param("ideationId", ParseIntPipe) ideationId: number,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body() updateIdeationDto: UpdateIdeationDto,
    ) {
        return this.ideationsService.updateIdeation(
            req,
            ideationId,
            teamId,
            updateIdeationDto,
        );
    }

    @ApiOperation({
        summary:
            "Deletes an ideation given a ideationId (int) and that the user that created it is logged in.",
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            "Invalid uuid or teamID. User is not authorized to perform this action.",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Ideation with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Ideation id or team member id given is invalid.",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully deleted ideation.",
        type: IdeationResponse,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: "Ideation cannot be deleted when any votes exist.",
        type: ConflictErrorResponse,
    })
    @Permissions(AppPermissions.OWN_TEAM)
    @Delete("/:ideationId")
    deleteIdeation(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("ideationId", ParseIntPipe) ideationId: number,
    ) {
        return this.ideationsService.deleteIdeation(req, teamId, ideationId);
    }

    @ApiOperation({
        summary:
            "Deletes an ideation vote given a ideationId (int) and teamId (int).",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Ideation or ideation vote with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            "Invalid uuid or teamID. User is not authorized to perform this action.",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully deleted ideation vote.",
        type: IdeationVoteResponse,
    })
    @Permissions(AppPermissions.OWN_TEAM)
    @Delete("/:ideationId/ideation-votes")
    deleteIdeationVote(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("ideationId", ParseIntPipe) ideationId: number,
    ) {
        return this.ideationsService.deleteIdeationVote(
            req,
            teamId,
            ideationId,
        );
    }

    @ApiOperation({
        summary: "Selects one ideation as team project for voyage.",
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            "Invalid uuid or teamID. User is not authorized to perform this action.",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Ideation with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: "An ideation has already been selected.",
        type: ConflictErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully selected ideation.",
        type: IdeationVoteResponse,
    })
    @Permissions(AppPermissions.OWN_TEAM)
    @Post("/:ideationId/select")
    setIdeationSelection(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("ideationId", ParseIntPipe) ideationId: number,
    ) {
        return this.ideationsService.setIdeationSelection(
            req,
            teamId,
            ideationId,
        );
    }

    @ApiOperation({
        summary: "Clears the current ideation selection for team.",
        description: "Admin only allowed.",
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            "Invalid uuid or teamID. User is not authorized to perform this action.",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Ideation with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully cleared ideation selection.",
        type: IdeationVoteResponse,
    })
    @Permissions(AppPermissions.OWN_TEAM)
    @Roles(AppRoles.Admin)
    @Post("/reset-selection")
    resetIdeationSelection(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamId: number,
    ) {
        return this.ideationsService.resetIdeationSelection(req, teamId);
    }
}
