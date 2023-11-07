import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    ValidationPipe,
} from "@nestjs/common";
import { TechsService } from "./techs.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTeamTechDto } from "./dto/create-tech.dto";
import { CreateTeamTechVoteDto } from "./dto/create-tech-vote.dto";
import { DeleteTeamTechVoteDto } from "./dto/delete-tech-vote.dto";

@Controller("techs")
@ApiTags("techs / techstack")
export class TechsController {
    constructor(private readonly techsService: TechsService) {}

    @ApiOperation({
        summary: "Gets all selected tech for a team given a teamId (int)",
    })
    @Get("/teams/:teamId")
    getAllTechItemsByTeamId(@Param("teamId", ParseIntPipe) teamId: number) {
        return this.techsService.getAllTechItemsByTeamId(teamId);
    }

    @ApiOperation({
        summary:
            "Adds a new tech (not already chosen by the team) to the team, and set first voter. UserId:uuid",
    })
    @Post("/teams/:teamId/techs")
    addNewTeamTech(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body(ValidationPipe) createTeamTechDto: CreateTeamTechDto,
    ) {
        return this.techsService.addNewTeamTech(teamId, createTeamTechDto);
    }

    @ApiOperation({
        summary:
            'Votes for an existing tech / adds the voter to the votedBy list. VotedBy: "UserId:uuid"',
    })
    @Post("/teams/:teamId/techs/:teamTechId")
    addExistingTechVote(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("teamTechId", ParseIntPipe) teamTechId: number,
        @Body() createTechVoteDto: CreateTeamTechVoteDto,
    ) {
        return this.techsService.addExistingTechVote(
            teamId,
            teamTechId,
            createTechVoteDto,
        );
    }

    @ApiOperation({
        summary: "Removes logged in users vote.",
    })
    @Delete("/teams/:teamId/techs/:teamTechId")
    removeVote(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("teamTechId", ParseIntPipe) teamTechId: number,
        @Body() deleteTechVoteDto: DeleteTeamTechVoteDto,
    ) {
        return this.techsService.removeVote(
            teamId,
            teamTechId,
            deleteTechVoteDto,
        );
    }
}
