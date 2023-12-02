import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    ParseIntPipe,
    Request,
    UseGuards,
} from "@nestjs/common";
import { TeamsService } from "./teams.service";
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { VoyageTeamEntity } from "./entities/team.entity";
import {
    VoyageTeamMemberEntity,
    VoyageTeamMemberUpdateEntity,
} from "./entities/team-member.entity";

@Controller("teams")
@ApiTags("teams")
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @ApiOperation({
        summary: "Gets all voyage teams.",
    })
    @ApiOkResponse({
        status: 200,
        description: "Successfully gets all voyage teams",
        type: VoyageTeamEntity,
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
    @ApiOkResponse({
        status: 200,
        description: "Successfully gets all the teams for a given voyage.",
        type: VoyageTeamEntity,
        isArray: true,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: "Voyage with given ID does not exist.",
    })
    @Get("voyages/:id")
    findTeamsByVoyageId(@Param("id", ParseIntPipe) id: number) {
        return this.teamsService.findTeamsByVoyageId(id);
    }

    @ApiOperation({
        summary: "Gets one team given a teamId (int).",
    })
    @ApiOkResponse({
        status: 200,
        description: "Successfully gets all the teams for a given voyage.",
        type: VoyageTeamEntity,
        isArray: false,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: "Voyage team with given ID does not exist.",
    })
    @Get(":id")
    findTeamById(@Param("id", ParseIntPipe) id: number) {
        return this.teamsService.findTeamById(id);
    }

    @ApiOperation({
        summary: "Gets all team members for a team given a teamId (int).",
    })
    @ApiOkResponse({
        status: 200,
        description: "Successfully gets all members of a voyage team.",
        type: VoyageTeamMemberEntity,
        isArray: true,
    })
    @Get(":id/members")
    findTeamMembersByTeamId(@Param("id", ParseIntPipe) id: number) {
        return this.teamsService.findTeamMembersByTeamId(id);
    }

    @ApiOperation({
        summary:
            "Updates team member hours per a sprint given a teamId (int) and userId (int).",
    })
    @ApiOkResponse({
        status: 200,
        description: "successfully update users sprints per hour",
        type: VoyageTeamMemberUpdateEntity,
    })
    @ApiUnauthorizedResponse({
        status: 401,
        description: "user is unauthorized to perform this action",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
