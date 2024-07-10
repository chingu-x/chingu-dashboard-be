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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
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
import { CustomRequest } from "../global/types/CustomRequest";
import { CheckAbilities } from "../global/decorators/abilities.decorator";
import { Action } from "../ability/ability.factory/ability.factory";

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
        description: "User is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description:
            "Ideation vote cannot be added, user is not in the team or team doesn't exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Successfully created a new ideation and vote added.",
        type: IdeationResponse,
    })
    @CheckAbilities({ action: Action.Create, subject: "Ideation" })
    @Post("teams/:teamId/ideations")
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
    @CheckAbilities({ action: Action.Create, subject: "Ideation" })
    @Post("ideations/:ideationId/ideation-votes")
    createIdeationVote(
        @Request() req: CustomRequest,
        @Param("ideationId", ParseIntPipe) ideationId: number,
    ) {
        return this.ideationsService.createIdeationVote(req, ideationId);
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
    @CheckAbilities({ action: Action.Read, subject: "Ideation" })
    @Get("teams/:teamId/ideations")
    getIdeationsByVoyageTeam(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Request() req: CustomRequest,
    ) {
        return this.ideationsService.getIdeationsByVoyageTeam(req, teamId);
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
    @CheckAbilities({ action: Action.Update, subject: "Ideation" })
    @Patch("ideations/:ideationId")
    updateIdeation(
        @Request() req: CustomRequest,
        @Param("ideationId", ParseIntPipe) ideationId: number,
        @Body() updateIdeationDto: UpdateIdeationDto,
    ) {
        return this.ideationsService.updateIdeation(
            req,
            ideationId,
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
    @CheckAbilities({ action: Action.Delete, subject: "Ideation" })
    @Delete("ideations/:ideationId")
    deleteIdeation(
        @Request() req: CustomRequest,
        @Param("ideationId", ParseIntPipe) ideationId: number,
    ) {
        return this.ideationsService.deleteIdeation(req, ideationId);
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
    @CheckAbilities({ action: Action.Delete, subject: "Ideation" })
    @Delete("teams/:teamId/ideations/:ideationId/ideation-votes")
    deleteIdeationVote(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("ideationId", ParseIntPipe) ideationId: number,
    ) {
        return this.ideationsService.deleteIdeationVote(req, ideationId);
    }

    @ApiOperation({
        summary: "Selects one ideation as team project for voyage.",
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "User is not authorized to perform this action.",
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
        status: HttpStatus.CREATED,
        description: "Successfully selected ideation.",
        type: IdeationResponse,
    })
    @ApiParam({
        name: "teamId",
        description: "voyage team Id",
        type: "Integer",
        required: true,
        example: 1,
    })
    @ApiParam({
        name: "ideationId",
        description: "ideation Id",
        type: "Integer",
        required: true,
        example: 1,
    })
    @CheckAbilities({ action: Action.Manage, subject: "Ideation" })
    @Post("teams/:teamId/ideations/:ideationId/select")
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
        description: "User is not authorized to perform this action.",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Ideation for this team does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Successfully cleared ideation selection.",
        type: IdeationResponse,
    })
    @ApiParam({
        name: "teamId",
        description: "voyage team Id",
        type: "Integer",
        required: true,
        example: 1,
    })
    @CheckAbilities({ action: Action.Manage, subject: "all" })
    @Post("teams/:teamId/ideations/reset-selection")
    resetIdeationSelection(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamId: number,
    ) {
        return this.ideationsService.resetIdeationSelection(req, teamId);
    }
}
