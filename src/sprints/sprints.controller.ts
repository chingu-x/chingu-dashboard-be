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
    Request,
    Query,
} from "@nestjs/common";
import { SprintsService } from "./sprints.service";
import { UpdateTeamMeetingDto } from "./dto/update-team-meeting.dto";
import { CreateTeamMeetingDto } from "./dto/create-team-meeting.dto";
import {
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { CreateAgendaDto } from "./dto/create-agenda.dto";
import { UpdateAgendaDto } from "./dto/update-agenda.dto";
import { FormInputValidationPipe } from "@/pipes/form-input-validation";
import { UpdateMeetingFormResponseDto } from "./dto/update-meeting-form-response.dto";
import {
    AgendaResponse,
    CheckinFormResponse,
    CheckinSubmissionResponse,
    MeetingFormResponse,
    MeetingResponse,
    MeetingResponseWithSprintAndAgenda,
    VoyageResponse,
    VoyageResponseWithoutMeetings,
} from "./sprints.response";
import {
    BadRequestErrorResponse,
    ConflictErrorResponse,
    ForbiddenErrorResponse,
    NotFoundErrorResponse,
    UnauthorizedErrorResponse,
} from "@/global/responses/errors";
import { FormResponse, ResponseResponse } from "@/forms/forms.response";
import { CreateCheckinFormDto } from "./dto/create-checkin-form.dto";
import { CustomRequest } from "@/global/types/CustomRequest";
import { VoyageTeamMemberValidationPipe } from "@/pipes/voyage-team-member-validation";
import { CheckinQueryDto } from "./dto/get-checkin-form-response";
import { Action } from "@/ability/ability.factory/ability.factory";
import { CheckAbilities } from "@/global/decorators/abilities.decorator";

@Controller()
@ApiTags("Voyage - Sprints")
export class SprintsController {
    constructor(private readonly sprintsService: SprintsService) {}

    // dev and admin purpose
    @CheckAbilities({ action: Action.Manage, subject: "all" })
    @Get()
    @ApiOperation({
        summary:
            "[Roles:Admin] gets all the voyages and sprints details in the database",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "successfully gets all voyage and sprints data",
        type: VoyageResponseWithoutMeetings,
        isArray: true,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    getVoyagesAndSprints() {
        return this.sprintsService.getVoyagesAndSprints();
    }

    @ApiOperation({
        summary:
            "[Permissions: Own Team] gets all the voyages and sprints given a teamId",
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
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiParam({
        name: "teamId",
        description: "Voyage team Id",
        required: true,
        example: 1,
    })
    @CheckAbilities({ action: Action.Read, subject: "Sprint" })
    @Get("teams/:teamId")
    getSprintDatesByTeamId(
        @Request() req: CustomRequest,
        @Param("teamId", ParseIntPipe) teamId: number,
    ) {
        return this.sprintsService.getSprintDatesByTeamId(teamId, req);
    }

    @ApiOperation({
        summary: "[Permissions: Own Team] gets meeting detail given meeting ID",
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
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiParam({
        name: "meetingId",
        required: true,
        description: "voyage team Meeting ID (TeamMeeting/id)",
        example: 1,
    })
    @CheckAbilities({ action: Action.Read, subject: "SprintMeetingOrAgenda" })
    @Get("meetings/:meetingId")
    getMeetingById(
        @Request() req: CustomRequest,
        @Param("meetingId", ParseIntPipe) meetingId: number,
    ) {
        return this.sprintsService.getMeetingById(meetingId, req);
    }

    @ApiOperation({
        summary:
            "[Permissions: Own Team] Creates a sprint meeting given a sprint number and team Id",
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
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
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
    @CheckAbilities({ action: Action.Create, subject: "SprintMeetingOrAgenda" })
    @Post(":sprintNumber/teams/:teamId/meetings")
    createTeamMeeting(
        @Request() req: CustomRequest,
        @Param("sprintNumber", ParseIntPipe) sprintNumber: number,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body(ValidationPipe) createTeamMeetingDto: CreateTeamMeetingDto,
    ) {
        return this.sprintsService.createTeamMeeting(
            teamId,
            sprintNumber,
            createTeamMeetingDto,
            req,
        );
    }

    @ApiOperation({
        summary: "[Permissions: Own Team] Updates a meeting given a meeting ID",
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
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiParam({
        name: "meetingId",
        required: true,
        description: "voyage team meeting ID",
        example: 1,
    })
    @CheckAbilities({ action: Action.Update, subject: "SprintMeetingOrAgenda" })
    @Patch("meetings/:meetingId")
    updateTeamMeeting(
        @Request() req: CustomRequest,
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Body(ValidationPipe) updateTeamMeetingDto: UpdateTeamMeetingDto,
    ) {
        return this.sprintsService.updateTeamMeeting(
            meetingId,
            updateTeamMeetingDto,
            req,
        );
    }

    @ApiOperation({
        summary: "[Permissions: Own Team] Adds an agenda item given meeting ID",
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
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiParam({
        name: "meetingId",
        required: true,
        description: "voyage team meeting ID",
        example: 1,
    })
    @CheckAbilities({ action: Action.Create, subject: "SprintMeetingOrAgenda" })
    @Post("meetings/:meetingId/agendas")
    addMeetingAgenda(
        @Request() req: CustomRequest,
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Body(ValidationPipe) createAgendaDto: CreateAgendaDto,
    ) {
        return this.sprintsService.createMeetingAgenda(
            meetingId,
            createAgendaDto,
            req,
        );
    }

    @ApiOperation({
        summary:
            "[Permissions: Own Team] Updates an agenda item given an agenda ID",
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
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiParam({
        name: "agendaId",
        required: true,
        description: "agenda ID",
        example: 1,
    })
    @CheckAbilities({ action: Action.Update, subject: "SprintMeetingOrAgenda" })
    @Patch("agendas/:agendaId")
    updateMeetingAgenda(
        @Request() req: CustomRequest,
        @Param("agendaId", ParseIntPipe) agendaId: number,
        @Body(ValidationPipe) updateAgendaDto: UpdateAgendaDto,
    ) {
        return this.sprintsService.updateMeetingAgenda(
            agendaId,
            updateAgendaDto,
            req,
        );
    }

    @ApiOperation({
        summary:
            "[Permissions: Own Team] Deletes an agenda item given agenda ID",
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
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiParam({
        name: "agendaId",
        required: true,
        description: "agenda ID",
        example: 1,
    })
    @CheckAbilities({ action: Action.Delete, subject: "SprintMeetingOrAgenda" })
    @Delete("agendas/:agendaId")
    deleteMeetingAgenda(
        @Request() req: CustomRequest,
        @Param("agendaId", ParseIntPipe) agendaId: number,
    ) {
        return this.sprintsService.deleteMeetingAgenda(agendaId, req);
    }

    @ApiOperation({
        summary:
            "[Permissions: Own Team] Adds sprint reviews or sprint planning section to the meeting",
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
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
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
    @CheckAbilities({ action: Action.ManageSprintForms, subject: "Sprint" })
    @Post("meetings/:meetingId/forms/:formId")
    addMeetingFormResponse(
        @Request() req: CustomRequest,
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Param("formId", ParseIntPipe) formId: number,
    ) {
        return this.sprintsService.addMeetingFormResponse(
            meetingId,
            formId,
            req,
        );
    }

    @ApiOperation({
        summary:
            "[Permissions: Own Team] Gets a form given meeting ID and formId",
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
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
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
    @CheckAbilities({ action: Action.ManageSprintForms, subject: "Sprint" })
    @Get("meetings/:meetingId/forms/:formId")
    getMeetingFormQuestionsWithResponses(
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Param("formId", ParseIntPipe) formId: number,
        @Request() req: CustomRequest,
    ) {
        return this.sprintsService.getMeetingFormQuestionsWithResponses(
            meetingId,
            formId,
            req,
        );
    }

    @ApiOperation({
        summary:
            "[Permissions: Own Team] Updates a form given meeting ID and formId",
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
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
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
    @CheckAbilities({ action: Action.ManageSprintForms, subject: "Sprint" })
    @Patch("meetings/:meetingId/forms/:formId")
    updateMeetingFormResponse(
        @Request() req: CustomRequest,
        @Param("meetingId", ParseIntPipe) meetingId: number,
        @Param("formId", ParseIntPipe) formId: number,
        @Body(new FormInputValidationPipe())
        updateMeetingFormResponse: UpdateMeetingFormResponseDto,
    ) {
        return this.sprintsService.updateMeetingFormResponse(
            meetingId,
            formId,
            updateMeetingFormResponse,
            req,
        );
    }

    @CheckAbilities({ action: Action.ManageSprintForms, subject: "Sprint" })
    @Post("check-in")
    @ApiOperation({
        summary: "[Permissions: Own Team] Submit end of sprint check in form",
        description:
            "Inputs (choiceId, text, boolean, number are all optional), <br>" +
            "depends on the question type, but AT LEAST ONE of them must be present, <br>" +
            "questionId is required <br><br>" +
            "responses example" +
            "<code>" +
            JSON.stringify([
                {
                    questionId: 1,
                    text: "All",
                },
                {
                    questionId: 2,
                    optionChoiceId: 1,
                },
                {
                    questionId: 3,
                    boolean: true,
                },
                {
                    questionId: 4,
                    numeric: 352,
                },
            ]) +
            "</code><br>",
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The check in form has been successfully Submitted.",
        type: CheckinSubmissionResponse,
        isArray: true,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description:
            "request body data error, e.g. missing question id, missing response inputs",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: "User has already submitted a check in for that sprint.",
        type: ConflictErrorResponse,
    })
    addCheckinFormResponse(
        @Body(new FormInputValidationPipe(), VoyageTeamMemberValidationPipe)
        createCheckinFormResponse: CreateCheckinFormDto,
    ) {
        return this.sprintsService.addCheckinFormResponse(
            createCheckinFormResponse,
        );
    }

    @ApiOperation({
        summary:
            "[Admin only]: gets check-in forms given a sprintNumber, voyageId, userId, teamId, or combination",
        description:
            "Takes any combination of 4 keys: sprintNumber, voyageId, userId, or teamId",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "successfully gets check-in form responses",
        type: CheckinFormResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "no matching check-in form response found",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "invalid key",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - user is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @ApiQuery({
        name: "teamId",
        required: false,
        description: "Example: 1",
    })
    @ApiQuery({
        name: "sprintNumber",
        required: false,
        description: "Example: 1",
    })
    @ApiQuery({
        name: "voyageNumber",
        required: false,
        description: "Example: 46",
    })
    @ApiQuery({
        name: "userId",
        required: false,
        description: "Example: 6bd33861-04c0-4270-8e96-62d4fb587527",
    })
    @CheckAbilities({ action: Action.Manage, subject: "all" })
    @Get("check-in")
    getCheckinFormResponse(@Query() query: CheckinQueryDto) {
        return this.sprintsService.getCheckinFormResponse(query);
    }
}
