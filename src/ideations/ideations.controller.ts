import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    ParseIntPipe,
    Request,
    UseGuards,
    HttpStatus,
} from "@nestjs/common";
import { IdeationsService } from "./ideations.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
    BadRequestErrorResponse,
    ConflictErrorResponse,
    NotFoundErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";
import {
    IdeationVoteResponse,
    IdeationResponse,
    TeamIdeationsResponse,
} from "./ideations.response";

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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    createIdeation(
        @Request() req,
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("/:ideationId/ideation-votes")
    createIdeationVote(
        @Request() req,
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
        status: HttpStatus.CONFLICT,
        description: "Uuid does not match team member ID on Ideation.",
        type: ConflictErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully updated ideation.",
        type: IdeationResponse,
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch("/:ideationId")
    updateIdeation(
        @Request() req,
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete("/:ideationId")
    deleteIdeation(
        @Request() req,
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete("/:ideationId/ideation-votes")
    deleteIdeationVote(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("ideationId", ParseIntPipe) ideationId: number,
    ) {
        return this.ideationsService.deleteIdeationVote(
            req,
            teamId,
            ideationId,
        );
    }
}
