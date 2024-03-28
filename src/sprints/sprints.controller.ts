import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    ParseIntPipe,
    Get,
    Delete,
    ValidationPipe,
    HttpStatus,
} from "@nestjs/common";
import { SprintsService } from "./sprints.service";
import { UpdateTeamMeetingDto } from "./dto/update-team-meeting.dto";
import { CreateTeamMeetingDto } from "./dto/create-team-meeting.dto";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateAgendaDto } from "./dto/create-agenda.dto";
import { UpdateAgendaDto } from "./dto/update-agenda.dto";
import { FormInputValidationPipe } from "../pipes/form-input-validation";
import { UpdateMeetingFormResponseDto } from "./dto/update-meeting-form-response.dto";
import {
    AgendaResponse,
    MeetingFormResponse,
    MeetingResponse,
    MeetingResponseWithSprintAndAgenda,
    VoyageResponse,
} from "./sprints.response";
import {
    BadRequestErrorResponse,
    ConflictErrorResponse,
    NotFoundErrorResponse,
} from "../global/responses/errors";
import { FormResponse, ResponseResponse } from "../forms/forms.response";

@Controller()
@ApiTags("Voyage - Sprints")
export class SprintsController {
    constructor(private readonly sprintsService: SprintsService) {}

    // dev and admin purpose
    @Get()
    @ApiOperation({
        summary: "gets all the voyages and sprints details in the database",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "successfully gets all voyage and sprints data",
        type: VoyageResponse,
        isArray: true,
    })
    getVoyagesAndSprints() {
        return this.sprintsService.getVoyagesAndSprints();
    }

    @Get("teams/:teamId")
    @ApiOperation({
        summary: "gets all the voyages and sprints given a teamId",
        description: "returns all the sprint dates of a particular team",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "successfully gets all voyage and sprints data of a team",
        type: VoyageResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid team Id. Record not found.",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "teamId",
        description: "Voyage team Id",
        required: true,
        example: 1,
    })
    getSprintDatesByTeamId(@Param("teamId", ParseIntPipe) teamId: number) {
        return this.sprintsService.getSprintDatesByTeamId(teamId);
    }

    // TODO: this route and most routes here will only be available to team member
    // To be added with authorization
    @Get("meetings/:meetingId")
    @ApiOperation({
        summary: "gets meeting detail given meeting ID",
        description:
            "returns meeting details such as title, meeting time, meeting link, notes, agenda, meeting forms. Everything needed to populate the meeting page.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets the meeting data",
        type: MeetingResponseWithSprintAndAgenda,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Meeting with the supplied Id not found",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "meetingId",
        required: true,
        description: "voyage team Meeting ID (TeamMeeting/id)",
        example: 1,
    })
    getMeetingById(@Param("meetingId", ParseIntPipe) meetingId: number) {
        return this.sprintsService.getMeetingById(meetingId);
    }

    @Post(":sprintNumber/teams/:teamId/meetings")
    @ApiOperation({
        summary: "Creates a sprint meeting given a sprint number and team Id",
        description: "Returns meeting details",
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The meeting has been created successfully.",
        type: MeetingResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad Request - Validation Error",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Resource (sprint Id or team Id) not found.",
        type: NotFoundErrorResponse,
    })
    // temporary till we decided to let user create more than one meeting per sprint
    // currently there's a design issue where teams can only create 1 meeting per sprint.
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: "A meeting already exist for this sprint.",
        type: ConflictErrorResponse,
    })
    @ApiParam({
        name: "sprintNumber",
        required: true,
        description: "sprint number of the voyage, e.g. 1, 2, 3, 4, 5, 6",
        example: 1,
    })
    @ApiParam({
        name: "teamId",
        required: true,
        description: "voyage team ID",
        example: 1,
    })
    createTeamMeeting(
        @Param("sprintNumber", ParseIntPipe) sprintNumber: number,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body(ValidationPipe) createTeamMeetingDto: CreateTeamMeetingDto,
    ) {
        return this.sprintsService.createTeamMeeting(
            teamId,
            sprintNumber,
            createTeamMeetingDto,
        );
    }

    @Patch("meetings/:meetingId")
    @ApiOperation({
        summary: "Updates a meeting given a meeting ID",
        description: "Updates meeting detail, including link, time, notes",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The meeting has been updated successfully.",
        type: MeetingResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid Meeting ID (MeetingId does not exist)",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "meetingId",
        required: true,
        description: "voyage team meeting ID",
        example: 1,
    })
    updateTeamMeeting(
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Body(ValidationPipe) updateTeamMeetingDto: UpdateTeamMeetingDto,
    ) {
        return this.sprintsService.updateTeamMeeting(
            meetingId,
            updateTeamMeetingDto,
        );
    }

    @Post("meetings/:meetingId/agendas")
    @ApiOperation({
        summary: "Adds an agenda item given meeting ID",
        description: "returns agenda item details.",
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The agenda has been created successfully.",
        type: AgendaResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad Request - Invalid Meeting ID",
        type: BadRequestErrorResponse,
    })
    @ApiParam({
        name: "meetingId",
        required: true,
        description: "voyage team meeting ID",
        example: 1,
    })
    addMeetingAgenda(
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Body(ValidationPipe) createAgendaDto: CreateAgendaDto,
    ) {
        return this.sprintsService.createMeetingAgenda(
            meetingId,
            createAgendaDto,
        );
    }

    @Patch("agendas/:agendaId")
    @ApiOperation({
        summary: "Updates an agenda item given an agenda ID",
        description: "returns updated agenda item details.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The agenda has been updated successfully.",
        type: AgendaResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid Agenda ID (AgendaId does not exist)",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "agendaId",
        required: true,
        description: "agenda ID",
        example: 1,
    })
    updateMeetingAgenda(
        @Param("agendaId", ParseIntPipe) agendaId: number,
        @Body(ValidationPipe) updateAgendaDto: UpdateAgendaDto,
    ) {
        return this.sprintsService.updateMeetingAgenda(
            agendaId,
            updateAgendaDto,
        );
    }

    @Delete("agendas/:agendaId")
    @ApiOperation({
        summary: "Deletes an agenda item given agenda ID",
        description: "returns deleted agenda item detail.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The agenda item has been successfully deleted",
        type: AgendaResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid Agenda ID (AgendaId does not exist)",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "agendaId",
        required: true,
        description: "agenda ID",
        example: 1,
    })
    deleteMeetingAgenda(@Param("agendaId", ParseIntPipe) agendaId: number) {
        return this.sprintsService.deleteMeetingAgenda(agendaId);
    }

    @Post("meetings/:meetingId/forms/:formId")
    @ApiOperation({
        summary:
            "Adds sprint reviews or sprint planning section to the meeting",
        description:
            "This creates a record which stores all the responses for this particular forms <br>" +
            'This should only work if the form type is "meeting"<br>' +
            '<ul><li>sprint review - form name: "Retrospective & Review", </li> ' +
            '<li>sprint planning - form name: "sprint Planning" </li></ul>' +
            "Note: form names are unique in the form table",
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The meeting form has been created succesfully",
        type: MeetingFormResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid formId or meetingId",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: `FormId and MeetingId combination should be unique. There's already an existing form of the given formId for this meeting Id`,
        type: ConflictErrorResponse,
    })
    @ApiParam({
        name: "meetingId",
        required: true,
        description: "team meeting ID",
        example: 1,
    })
    @ApiParam({
        name: "formId",
        required: true,
        description: "form ID",
        example: 1,
    })
    addMeetingFormResponse(
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Param("formId", ParseIntPipe) formId: number,
    ) {
        return this.sprintsService.addMeetingFormResponse(meetingId, formId);
    }

    @Get("meetings/:meetingId/forms/:formId")
    @ApiOperation({
        summary: "Gets a form given meeting ID and formId",
        description: "returns the form, including questions and responses",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully get the meeting form with responses",
        type: FormResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid formId",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "invalid meetingId",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "meetingId",
        required: true,
        description: "team meeting ID",
        example: 1,
    })
    @ApiParam({
        name: "formId",
        required: true,
        description: "form ID",
        example: 1,
    })
    getMeetingFormQuestionsWithResponses(
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Param("formId", ParseIntPipe) formId: number,
    ) {
        return this.sprintsService.getMeetingFormQuestionsWithResponses(
            meetingId,
            formId,
        );
    }

    @Patch("meetings/:meetingId/forms/:formId")
    @ApiOperation({
        summary: "Updates a form given meeting ID and formId",
        description:
            "Returns the updated form, including questions and responses <br>" +
            "A sample body <br>" +
            "<code>" +
            JSON.stringify([
                {
                    questionId: 1,
                    text: "All",
                },
                {
                    questionId: 2,
                    text: "Deploy app",
                },
            ]) +
            "</code><br>" +
            "choiceId, text, boolean, number are all optional, " +
            "depends on the question type, but at least one of them must be present",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The meeting form has been successfully updated",
        type: ResponseResponse,
        isArray: true,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description:
            "invalid meeting id, form id, question id(s) not found in form with a given formId, responses not an array",
        type: BadRequestErrorResponse,
    })
    @ApiParam({
        name: "meetingId",
        required: true,
        description: "team meeting ID",
        example: 1,
    })
    @ApiParam({
        name: "formId",
        required: true,
        description: "form ID",
        example: 1,
    })
    updateMeetingFormResponse(
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Param("formId", ParseIntPipe) formId: number,
        @Body(new FormInputValidationPipe())
        updateMeetingFormResponse: UpdateMeetingFormResponseDto,
    ) {
        return this.sprintsService.updateMeetingFormResponse(
            meetingId,
            formId,
            updateMeetingFormResponse,
        );
    }
}
