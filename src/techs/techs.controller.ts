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
import { CreateTechStackCategoryDto } from "./dto/create-techstack-category.dto";
import { UpdateTechStackCategoryDto } from "./dto/update-techstack-category.dto";
import {
    TeamTechResponse,
    TechItemResponse,
    TechItemDeleteResponse,
    TechItemUpdateResponse,
    TechCategoryResponse,
    TechCategoryDeleteResponse,
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
        summary:
            "[Permission: own_team] Gets all selected tech for a team given a teamId (int)",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets all selected tech stack for a team",
        type: TeamTechResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid team id",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
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
            "[Permission: own_team] Adds a new tech (not already chosen by the team) to the team, and set first voter.",
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
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
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
        summary:
            "[Permission: own_team] Updates a existing tech stack item in the team",
        description: "Requires login",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully updated a tech stack item",
        type: TechItemUpdateResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
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
        summary: "[Permission: own_team] Delete a tech stack item of a team",
        description: "Requires login",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Tech stack item  was successfully deleted",
        type: TechItemDeleteResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
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
    @CheckAbilities({ action: Action.Delete, subject: "TeamTechStackItem" })
    @Delete("techs/:teamTechItemId")
    deleteTeamTech(
        @Request() req: CustomRequest,
        @Param("teamTechItemId", ParseIntPipe) teamTechItemId: number,
    ) {
        return this.techsService.deleteTeamTech(req, teamTechItemId);
    }

    @ApiOperation({
        summary:
            "[Permission: own_team] Adds a new tech stack category to the team.",
        description: "Requires login",
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Successfully added a new tech stack category",
        type: TechCategoryResponse,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: "Tech stack category already exist for the team",
        type: ConflictErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid userId",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @Post("teams/:teamId/techStackCategory")
    addNewTechStackCategory(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamTId: number,
        @Body(ValidationPipe, VoyageTeamMemberValidationPipe)
        createTechStackCategoryDto: CreateTechStackCategoryDto,
    ) {
        return this.techsService.addNewTechStackCategory(
            req,
            createTechStackCategoryDto,
        );
    }

    @ApiOperation({
        summary:
            "[Permission: own_team] Updates an existing tech stack category in the team",
        description: "Requires login",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully updated a tech stack category",
        type: TechCategoryResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad Request - tech stack category couldn't be updated",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: "Tech stack category already exists for the team",
        type: ConflictErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid tech stack category id",
        type: NotFoundErrorResponse,
    })
    @Patch("teams/techStackCategory")
    updateTechStackCategory(
        @Request() req: CustomRequest,
        @Body(ValidationPipe)
        updateTechStackCategoryDto: UpdateTechStackCategoryDto,
    ) {
        return this.techsService.updateTechStackCategory(
            req,
            updateTechStackCategoryDto,
        );
    }

    @ApiOperation({
        summary: "[Permission: own_team] Delete a team's tech stack category",
        description: "Requires login",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Tech stack category was successfully deleted",
        type: TechCategoryDeleteResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad Request - tech stack category couldn't be deleted",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid tech stack category id",
        type: NotFoundErrorResponse,
    })
    @Delete("teams/:teamId/techStackCategory/:techStackCategoryId")
    deleteTechStackCategory(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("techStackCategoryId", ParseIntPipe) techStackCategoryId: number,
    ) {
        return this.techsService.deleteTechStackCategory(
            req,
            teamId,
            techStackCategoryId,
        );
    }

    @ApiOperation({
        summary:
            '[Permission: own_team] Votes for an existing tech / adds the voter to the votedBy list. VotedBy: "UserId:uuid"',
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
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiParam({
        name: "teamTechItemId",
        description: "techId of a tech the team has select (TeamTechStackItem)",
        type: "Integer",
        required: true,
        example: 6,
    })
    @CheckAbilities({ action: Action.Create, subject: "TeamTechStackItem" })
    @Post("techs/:teamTechItemId/vote")
    addExistingTechVote(
        @Request() req: CustomRequest,
        @Param("teamTechItemId", ParseIntPipe) teamTechItemId: number,
    ) {
        return this.techsService.addExistingTechVote(req, teamTechItemId);
    }

    @ApiOperation({
        summary: "[Permission: own_team] Removes logged in users vote.",
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
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiParam({
        name: "teamTechItemId",
        description: "techId of a tech the team has select (TeamTechStackItem)",
        type: "Integer",
        required: true,
        example: 6,
    })
    @CheckAbilities({ action: Action.Delete, subject: "TeamTechStackItem" })
    @Delete("techs/:teamTechItemId/vote")
    removeVote(
        @Request() req: CustomRequest,
        @Param("teamTechItemId", ParseIntPipe) teamTechItemId: number,
    ) {
        return this.techsService.removeVote(req, teamTechItemId);
    }

    @ApiOperation({
        summary:
            "[Permission: own_team]  Updates arrays of tech stack items, grouped by categoryId, sets 'isSelected' values",
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
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiParam({
        name: "teamId",
        description: "voyage team Id",
        type: "Integer",
        required: true,
        example: 2,
    })
    @CheckAbilities({ action: Action.Update, subject: "TeamTechStackItem" })
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
