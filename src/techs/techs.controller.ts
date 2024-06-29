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
import {
    TeamTechResponse,
    TechItemResponse,
    TechItemDeleteResponse,
    TechItemUpdateResponse,
} from "./techs.response";
import {
    BadRequestErrorResponse,
    ConflictErrorResponse,
    ForbiddenErrorResponse,
    NotFoundErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";
import { UpdateTeamTechDto } from "./dto/update-tech.dto";
import { CustomRequest } from "../global/types/CustomRequest";
import { CheckAbilities } from "../global/decorators/abilities.decorator";
import { Action } from "../ability/ability.factory/ability.factory";
import { VoyageTeamMemberValidationPipe } from "../pipes/voyage-team-member-validation";

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
    @Get("teams/:teamId/techs")
    @CheckAbilities({ action: Action.Read, subject: "TeamTechStackItem" })
    getAllTechItemsByTeamId(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamId: number,
    ) {
        return this.techsService.getAllTechItemsByTeamId(teamId, req);
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
        example: 2,
    })
    @CheckAbilities({ action: Action.Create, subject: "TeamTechStackItem" })
    @Post("teams/:teamId/techs")
    addNewTeamTech(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body(ValidationPipe, VoyageTeamMemberValidationPipe)
        createTeamTechDto: CreateTeamTechDto,
    ) {
        return this.techsService.addNewTeamTech(req, teamId, createTeamTechDto);
    }

    @ApiOperation({
        summary: "Updates a existing tech stack item in the team",
        description: "Requires login",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully updated a tech stack item",
        type: TechItemUpdateResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "User is unauthorized to perform this action",
        type: ForbiddenErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized when user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad Request - Tech Stack Item couldn't be updated",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: "Tech stack item already exist for the team",
        type: ConflictErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid tech stack item id",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "teamTechItemId",
        description: "team tech stack item Id",
        type: "Integer",
        required: true,
        example: 1,
    })
    @CheckAbilities({ action: Action.Update, subject: "TeamTechStackItem" })
    @Patch("techs/:teamTechItemId")
    updateTeamTech(
        @Request() req: CustomRequest,
        @Param("teamTechItemId", ParseIntPipe) teamTechItemId: number,
        @Body(ValidationPipe) updateTeamTechDto: UpdateTeamTechDto,
    ) {
        return this.techsService.updateExistingTeamTech(
            req,
            updateTeamTechDto,
            teamTechItemId,
        );
    }

    @ApiOperation({
        summary: "Delete a tech stack item of a team",
        description: "Requires login",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Tech stack item  was successfully deleted",
        type: TechItemDeleteResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "User is unauthorized to perform this action",
        type: ForbiddenErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized when user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad Request - Tech stack item couldn't be deleted",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid tech stack item id",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "teamTechItemId",
        description: "team tech stack item Id",
        type: "Integer",
        required: true,
        example: 1,
    })
    @Delete("techs/:teamTechItemId")
    deleteTeamTech(
        @Request() req: CustomRequest,
        @Param("teamTechItemId", ParseIntPipe) teamTechItemId: number,
    ) {
        return this.techsService.deleteTeamTech(req, teamTechItemId);
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
        name: "teamTechItemId",
        description: "techId of a tech the team has select (TeamTechStackItem)",
        type: "Integer",
        required: true,
        example: 6,
    })
    @Post("techs/:teamTechItemId/vote")
    addExistingTechVote(
        @Request() req: CustomRequest,
        @Param("teamTechItemId", ParseIntPipe) teamTechItemId: number,
    ) {
        return this.techsService.addExistingTechVote(req, teamTechItemId);
    }

    @ApiOperation({
        summary: "Removes logged in users vote.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            "Successfully removed a vote for an existing tech stack item by a user or removes the tech stack item if no votes left",
        type: TechItemDeleteResponse,
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
        name: "teamTechItemId",
        description: "techId of a tech the team has select (TeamTechStackItem)",
        type: "Integer",
        required: true,
        example: 6,
    })
    @Delete("techs/:teamTechItemId/vote")
    removeVote(
        @Request() req: CustomRequest,
        @Param("teamTechItemId", ParseIntPipe) teamTechItemId: number,
    ) {
        return this.techsService.removeVote(req, teamTechItemId);
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
    @Patch("teams/:teamId/techs/selections")
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
