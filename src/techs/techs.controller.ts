import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
import { TechsService } from './techs.service';
import { UpdateTechDto } from './dto/update-tech.dto';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {CreateTechVoteDto} from "./dto/create-tech-vote.dto";

@Controller('techs')
@ApiTags('techs / techstack')
export class TechsController {
  constructor(private readonly techsService: TechsService) {}

  @ApiOperation({
    description:"Gets all selected tech for a team given a teamId (int)"
  })
  @Get('/team/:teamId')
  findAllTechItemsByTeamId(
      @Param('teamId', ParseIntPipe) teamId: number
  ) {
    return this.techsService.findAllByTeamId(teamId);
  }

  @ApiOperation({description:"Adds a new tech (not already chosen by the team) to the team, and set first voter. UserId:uuid"})
  @Post('/team/:teamId/tech/:techId/new')
  addNewTechVote(
      @Param('teamId', ParseIntPipe) teamId: number,
      @Param('techId', ParseIntPipe) techId: number,
      @Body() createTechVoteDto: CreateTechVoteDto) {
    return this.techsService.addNewTechVote(teamId, techId, createTechVoteDto);
  }

  @ApiOperation({description:"Adds an existing tech (someone in the team has already voted/added) to the team, add the voter to the votedBy list. UserId:uuid"})
  @Patch('/team/:teamId/tech/:teamTechId')
  addExistingTechVote(
      @Param('teamId', ParseIntPipe) teamId: number,
      @Param('teamTechId', ParseIntPipe) teamTechId: number,
      @Body() createTechVoteDto: CreateTechVoteDto) {
    return this.techsService.addExistingTechVote(teamId, teamTechId, createTechVoteDto);
  }

  @ApiOperation({
    description:"Edit/Remove own vote"
  })
  @Delete('/team/:teamId/tech/:teamTechId')
  removeVote(@Param('teamId', ParseIntPipe) teamId: number,
             @Param('teamTechId', ParseIntPipe) teamTechId: number,
             @Body() createTechVoteDto: CreateTechVoteDto) {
    return this.techsService.removeVote(teamId,teamTechId, createTechVoteDto);
  }
}
