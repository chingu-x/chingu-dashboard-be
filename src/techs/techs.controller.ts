import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    ValidationPipe,
    Request,
    HttpStatus,
} from "@nestjs/common";
import { TechsService } from "./techs.service";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateTeamTechDto } from "./dto/create-tech.dto";
import { UpdateTechSelectionsDto } from "./dto/update-tech-selections.dto";
import { TeamTechResponse, TechItemResponse } from "./techs.response";
import {
    BadRequestErrorResponse,
    ConflictErrorResponse,
    NotFoundErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";

@Controller()
@ApiTags("Voyage - Techs")
export class TechsController {
    constructor(private readonly techsService: TechsService) {}

    @ApiOperation({
        summary: "Gets all selected tech for a team given a teamId (int)",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets all selected tech stack for a team",
        type: TeamTechResponse,
    })
    @ApiParam({
        name: "teamId",
        description: "voyage team Id",
        type: "Integer",
        required: true,
        example: 1,
    })
    @Get()
    getAllTechItemsByTeamId(@Param("teamId", ParseIntPipe) teamId: number) {
        return this.techsService.getAllTechItemsByTeamId(teamId);
    }

    @ApiOperation({
        summary:
            "Adds a new tech (not already chosen by the team) to the team, and set first voter.",
        description: "Requires login",
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Successfully added a new tech stack item",
        type: TechItemResponse,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: "Tech stack item already exist for the team",
        type: ConflictErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid TeamId or userId",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized",
        type: UnauthorizedErrorResponse,
    })
    @ApiParam({
        name: "teamId",
        description: "voyage team Id",
        type: "Integer",
        required: true,
        example: 1,
    })
    @Post()
    addNewTeamTech(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body(ValidationPipe) createTeamTechDto: CreateTeamTechDto,
    ) {
        return this.techsService.addNewTeamTech(req, teamId, createTeamTechDto);
    }

    @ApiOperation({
        summary:
            'Votes for an existing tech / adds the voter to the votedBy list. VotedBy: "UserId:uuid"',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description:
            "Successfully added a vote for an existing tech stack item by a user",
        type: TechItemResponse,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: "Tech stack item already exist for the team",
        type: ConflictErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid TeamId or userId",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized",
        type: UnauthorizedErrorResponse,
    })
    @ApiParam({
        name: "teamId",
        description: "voyage team Id",
        type: "Integer",
        required: true,
        example: 2,
    })
    @ApiParam({
        name: "teamTechId",
        description: "techId of a tech the team has select (TeamTechStackItem)",
        type: "Integer",
        required: true,
        example: 6,
    })
    @Post("/:teamTechId")
    addExistingTechVote(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("teamTechId", ParseIntPipe) teamTechId: number,
    ) {
        return this.techsService.addExistingTechVote(req, teamId, teamTechId);
    }

    @ApiOperation({
        summary: "Removes logged in users vote.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            "Successfully removed a vote for an existing tech stack item by a user",
        type: TechItemResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Vote to be deleted not found in the database",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid TeamId or userId",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized",
        type: UnauthorizedErrorResponse,
    })
    @ApiParam({
        name: "teamId",
        description: "voyage team Id",
        type: "Integer",
        required: true,
        example: 2,
    })
    @ApiParam({
        name: "teamTechId",
        description: "techId of a tech the team has select (TeamTechStackItem)",
        type: "Integer",
        required: true,
        example: 6,
    })
    @Delete("/:teamTechId")
    removeVote(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("teamTechId", ParseIntPipe) teamTechId: number,
    ) {
        return this.techsService.removeVote(req, teamId, teamTechId);
    }

    @ApiOperation({
        summary:
            "Updates arrays of tech stack items, grouped by categoryId, sets 'isSelected' values",
        description:
            "Maximum of 3 selections per category allowed.  All tech items (isSelected === true/false) are required for updated categories. Login required.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully updated selected tech stack items",
        type: TechItemResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid TeamId or UserId",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized",
        type: UnauthorizedErrorResponse,
    })
    @ApiParam({
        name: "teamId",
        description: "voyage team Id",
        type: "Integer",
        required: true,
        example: 2,
    })
    @Patch("/selections")
    updateTechStackSelections(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body(ValidationPipe) updateTechSelectionsDto: UpdateTechSelectionsDto,
    ) {
        return this.techsService.updateTechStackSelections(
            req,
            teamId,
            updateTechSelectionsDto,
        );
    }
}
