import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
import {SprintsService} from './sprints.service';
import {CreateSprintDto} from './dto/create-sprint.dto';
import {UpdateSprintDto} from './dto/update-sprint.dto';
import {CreateTeamMeetingDto} from "./dto/create-team-meeting-dto";
import {
    ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam, ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

@Controller('sprints')
@ApiTags("sprints")
export class SprintsController {
    constructor(private readonly sprintsService: SprintsService) {
    }

    @ApiOperation({
        description: "Create a sprint meeting given a sprint number and team Id"
    })
    @ApiCreatedResponse({
        status: 201,
        description: "The meeting has been successfully created."
    })
    @ApiBadRequestResponse({
        status: 400,
        description: "Bad Request - Validation Error"
    })
    @ApiNotFoundResponse({
        description: "Resource not found."
    })
    @Post(':sprintNumber/teams/:teamId/meetings/new')
    @ApiParam({
        name: 'sprintNumber',
        required: true,
        description: 'sprint number of the voyage, e.g. 1, 2, 3, 4, 5, 6'
    })
    @ApiParam(
        {
            name: 'teamId',
            required: true,
            description: 'voyage team ID'
        }
    )
    create(
        @Param("sprintNumber", ParseIntPipe) sprintNumber: number,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body() createTeamMeetingDto: CreateTeamMeetingDto) {
        return this.sprintsService.createTeamMeeting(teamId, sprintNumber,createTeamMeetingDto);
    }

    @Get()
    findAll() {
        return this.sprintsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sprintsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto) {
        return this.sprintsService.update(+id, updateSprintDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.sprintsService.remove(+id);
    }
}
