import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    ParseIntPipe,
} from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { ApiTags } from "@nestjs/swagger";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";

@Controller("teams")
@ApiTags("teams")
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Get()
    findAll() {
        return this.teamsService.findAll();
    }

    // Will need to be fixed to be RESTful
    @Get("voyages/:id")
    findTeamsByVoyageId(@Param("id", ParseIntPipe) id: number) {
        return this.teamsService.findAllByVoyageId(id);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.teamsService.findOne(id);
    }

    @Get(":id/members")
    findTeamMembersByTeamId(@Param("id", ParseIntPipe) id: number) {
        return this.teamsService.findTeamMembersByTeamId(id);
    }

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
