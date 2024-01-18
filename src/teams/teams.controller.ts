import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    ParseIntPipe,
    Request,
    HttpStatus,
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

@Controller("teams")
@ApiTags("teams")
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @ApiOperation({
        summary: "Gets all voyage teams.",
        description: "For development/admin purpose",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets all voyage teams",
        type: VoyageTeamResponse,
        isArray: true,
    })
    @Get()
    findAll() {
        return this.teamsService.findAll();
    }

    @ApiOperation({
        summary: "Gets all teams for a voyage given a voyageId (int).",
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
    @Get("voyages/:voyageId")
    findTeamsByVoyageId(@Param("voyageId", ParseIntPipe) voyageId: number) {
        return this.teamsService.findTeamsByVoyageId(voyageId);
    }

    @ApiOperation({
        summary: "Gets one team given a teamId (int).",
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
    @Get(":teamId")
    findTeamById(@Param("teamId", ParseIntPipe) teamId: number) {
        return this.teamsService.findTeamById(teamId);
    }

    @ApiOperation({
        summary:
            "Updates team member hours per a sprint given a teamId (int) and userId (int).",
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
    @Patch(":teamId/members")
    update(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Request() req,
        @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    ) {
        return this.teamsService.updateTeamMemberById(
            teamId,
            req,
            updateTeamMemberDto,
        );
    }
}
