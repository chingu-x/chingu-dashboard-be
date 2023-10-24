import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Controller('teamResources')
@ApiTags('Team Resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @ApiOperation({
    description: "",
  })
  @Post(':teamMemberId')
  create(
    @Body() createResourceDto: CreateResourceDto,
    @Param('teamMemberId', ParseIntPipe) teamMemberId: number 
  ) {
    return this.resourcesService.create(createResourceDto, teamMemberId);
  }

  @ApiOperation({
    description: "",
  })
  @Get(':teamId')
  findAll(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.resourcesService.findAll(teamId);
  }

  @ApiOperation({
    description: "",
  })
  @Patch(':teamMemberId/:resourceId')
  update(
    @Param('teamMemberId', ParseIntPipe) teamMemberId: number, 
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Body() updateResourceDto: UpdateResourceDto
  ) {
      return this.resourcesService.update(teamMemberId, resourceId, updateResourceDto);
  }

  @ApiOperation({
    description: "",
  })
  @Delete(':teamMemberId/:resourceId')
  remove(
    @Param('teamMemberId', ParseIntPipe) teamMemberId: number, 
    @Param('resourceId', ParseIntPipe) resourceId: number
  ) {
      return this.resourcesService.remove(teamMemberId, resourceId);
  }
}
