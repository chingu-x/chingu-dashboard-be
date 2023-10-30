import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    ParseIntPipe,
} from "@nestjs/common";
import { SprintsService } from "./sprints.service";
import { UpdateTeamMeetingDto } from "./dto/update-team-meeting.dto";
import { CreateTeamMeetingDto } from "./dto/create-team-meeting.dto";
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";
import { CreateAgendaDto } from "./dto/create-agenda.dto";
import { UpdateAgendaDto } from "./dto/update-agenda.dto";
import { CreateMeetingFormResponseDto } from "./dto/create-meeting-form-response.dto";

@Controller("sprints")
@ApiTags("sprints")
export class SprintsController {
    constructor(private readonly sprintsService: SprintsService) {}

    @Post(":sprintNumber/teams/:teamId/meetings")
    @ApiOperation({
        description:
            "Create a sprint meeting given a sprint number and team Id",
    })
    @ApiCreatedResponse({
        status: 201,
        description: "The meeting has been created successfully.",
    })
    @ApiBadRequestResponse({
        status: 400,
        description: "Bad Request - Validation Error",
    })
    @ApiNotFoundResponse({
        description: "Resource not found.",
    })
    @ApiParam({
        name: "sprintNumber",
        required: true,
        description: "sprint number of the voyage, e.g. 1, 2, 3, 4, 5, 6",
    })
    @ApiParam({
        name: "teamId",
        required: true,
        description: "voyage team ID",
    })
    createTeamMeeting(
        @Param("sprintNumber", ParseIntPipe) sprintNumber: number,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body() createTeamMeetingDto: CreateTeamMeetingDto,
    ) {
        return this.sprintsService.createTeamMeeting(
            teamId,
            sprintNumber,
            createTeamMeetingDto,
        );
    }

    @ApiOkResponse({
        status: 200,
        description: "The meeting has been updated successfully.",
    })
    @ApiNotFoundResponse({
        status: 404,
        description: "Invalid Meeting ID (MeetingId does not exist)",
    })
    @Patch("meetings/:meetingId")
    editTeamMeeting(
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Body() updateTeamMeetingDto: UpdateTeamMeetingDto,
    ) {
        return this.sprintsService.updateTeamMeeting(
            meetingId,
            updateTeamMeetingDto,
        );
    }

    @ApiCreatedResponse({
        status: 201,
        description: "The agenda has been created successfully.",
    })
    @ApiBadRequestResponse({
        status: 400,
        description: "Bad Request - Invalid Meeting ID",
    })
    @Post("meetings/:meetingId/agendas")
    addMeetingAgenda(
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Body() createAgendaDto: CreateAgendaDto,
    ) {
        return this.sprintsService.createMeetingAgenda(
            meetingId,
            createAgendaDto,
        );
    }

    @ApiOkResponse({
        status: 200,
        description: "The agenda has been updated successfully.",
    })
    @ApiNotFoundResponse({
        status: 404,
        description: "Invalid Agenda ID (AgendaId does not exist)",
    })
    @Patch("agendas/:agendaId")
    updateMeetingAgenda(
        @Param("agendaId", ParseIntPipe) agendaId: number,
        @Body() updateAgendaDto: UpdateAgendaDto,
    ) {
        return this.sprintsService.updateMeetingAgenda(
            agendaId,
            updateAgendaDto,
        );
    }

    @Post("meetings/:meetingId/forms/:formId")
    addMeetingFormResponse(
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Param("formId", ParseIntPipe) formId: number,
        @Body() createMeetingFormResponse: CreateMeetingFormResponseDto,
    ) {
        return this.sprintsService.addMeetingFormResponse(
            meetingId,
            formId,
            createMeetingFormResponse,
        );
    }
}
