import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Request,
} from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import {
    PublicVoyageTeamWithUserResponse,
    VoyageTeamMemberUpdateResponse,
    VoyageTeamResponse,
} from "./teams.response";
import {
    NotFoundErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";
import { CheckAbilities } from "../global/decorators/abilities.decorator";
import { Action } from "../ability/ability.factory/ability.factory";
import { CustomRequest } from "../global/types/CustomRequest";

@Controller("teams")
@ApiTags("teams")
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @ApiOperation({
        summary: "[Roles: Admin] Gets all voyage teams.",
        description: "[access]: admin <br> For development/admin purpose",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets all voyage teams",
        type: VoyageTeamResponse,
        isArray: true,
    })
    @CheckAbilities({ action: Action.Manage, subject: "all" })
    @Get()
    findAll() {
        return this.teamsService.findAll();
    }

    @ApiOperation({
        summary:
            "[Roles: Admin] Gets all teams for a voyage given a voyageId (int).",
        description: "[access]: admin <br>",
    })
    // Will need to be fixed to be RESTful
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets all the teams for a given voyage.",
        type: PublicVoyageTeamWithUserResponse,
        isArray: true,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Voyage with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "voyageId",
        description: "voyage id from the voyage table",
        type: "Integer",
        required: true,
        example: 1,
    })
    @CheckAbilities({ action: Action.Manage, subject: "all" })
    @Get("voyages/:voyageId")
    findTeamsByVoyageId(@Param("voyageId", ParseIntPipe) voyageId: number) {
        return this.teamsService.findTeamsByVoyageId(voyageId);
    }

    @ApiOperation({
        summary: "[Permission: own_team] Gets one team given a teamId (int).",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets all the teams for a given voyage.",
        type: PublicVoyageTeamWithUserResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Voyage team with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "teamId",
        description: "voyage team Id",
        type: "Integer",
        required: true,
        example: 1,
    })
    @CheckAbilities({ action: Action.Read, subject: "VoyageTeam" })
    @Get(":teamId")
    findTeamById(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Request() req: CustomRequest,
    ) {
        return this.teamsService.findTeamById(teamId, req.user);
    }

    @ApiOperation({
        summary:
            "[Permission: own_team] Updates team member hours per a sprint given a teamId (int) and userId (int).",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "successfully update users sprints per hour",
        type: VoyageTeamMemberUpdateResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "user is unauthorized to perform this action",
        type: UnauthorizedErrorResponse,
    })
    @ApiParam({
        name: "teamId",
        description: "voyage team Id",
        type: "Integer",
        required: true,
        example: 1,
    })
    @CheckAbilities({ action: Action.Update, subject: "VoyageTeam" })
    @Patch(":teamId/members")
    update(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Request() req: CustomRequest,
        @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    ) {
        return this.teamsService.updateTeamMemberById(
            teamId,
            req,
            updateTeamMemberDto,
        );
    }
}
