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
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

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
