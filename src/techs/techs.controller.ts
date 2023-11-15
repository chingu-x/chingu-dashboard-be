import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    ValidationPipe,
    Request,
    UseGuards,
} from "@nestjs/common";
import { TechsService } from "./techs.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTeamTechDto } from "./dto/create-tech.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("/teams/:teamId/techs")
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("/teams/:teamId/techs/:teamTechId")
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete("/teams/:teamId/techs/:teamTechId")
    removeVote(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("teamTechId", ParseIntPipe) teamTechId: number,
    ) {
        return this.techsService.removeVote(req, teamId, teamTechId);
    }
}
