import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    ParseIntPipe,
} from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";

@Controller("teams")
@ApiTags("teams")
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @ApiOperation({
        summary: "Gets all teams.",
    })
    @Get()
    findAll() {
        return this.teamsService.findAll();
    }

    @ApiOperation({
        summary: "Gets all teams for a voyage given a voyageId (int).",
    })
    // Will need to be fixed to be RESTful
    @Get("voyages/:id")
    findTeamsByVoyageId(@Param("id", ParseIntPipe) id: number) {
        return this.teamsService.findAllByVoyageId(id);
    }

    @ApiOperation({
        summary: "Gets one team given a teamId (int).",
    })
    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.teamsService.findOne(id);
    }

    @ApiOperation({
        summary: "Gets all team members for a team given a teamId (int).",
    })
    @Get(":id/members")
    findTeamMembersByTeamId(@Param("id", ParseIntPipe) id: number) {
        return this.teamsService.findTeamMembersByTeamId(id);
    }

    @ApiOperation({
        summary:
            "Updates team member hours per a sprint given a teamId (int) and userId (int).",
    })
    @Patch(":teamId/members/:userId")
    update(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("userId") userId: string,
        @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    ) {
        return this.teamsService.updateTeamMemberById(
            teamId,
            userId,
            updateTeamMemberDto,
        );
    }
}
