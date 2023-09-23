import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import {ApiTags} from "@nestjs/swagger";
import {UpdateTeamMemberDto} from "./dto/update-team-member.dto";

@Controller('teams')
@ApiTags('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // Not implemented yet, this would be an admin route
  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get('voyage/:id')
  findTeamsByVoyageId(
      @Param('id', ParseIntPipe) id:number
  ) {
    return this.teamsService.findAllByVoyageId(id)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  @Get(':id/members')
  findTeamMembersByTeamId(
      @Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findTeamMembersByTeamId(id)
  }


  @Patch(':teamId/member/:userId')
  update(
      @Param('teamId', ParseIntPipe) teamId: number,
      @Param('userId') userId: string,
      @Body() updateTeamMemberDto: UpdateTeamMemberDto) {
    return this.teamsService.updateTeamMemberById(teamId,userId, updateTeamMemberDto);
  }

  // admin action
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }
}
