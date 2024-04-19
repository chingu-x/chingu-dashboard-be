import { Body, Controller, HttpStatus, Post, Request } from "@nestjs/common";
import { VoyagesService } from "./voyages.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FormInputValidationPipe } from "../pipes/form-input-validation";
import { CreateVoyageProjectSubmissionDto } from "./dto/create-voyage-project-submission.dto";
import { CheckinSubmissionResponse } from "../sprints/sprints.response";
import {
    BadRequestErrorResponse,
    ConflictErrorResponse,
    ForbiddenErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";
import { CustomRequest } from "../global/types/CustomRequest";

@Controller("voyages")
@ApiTags("voyages")
export class VoyagesController {
    constructor(private readonly voyagesService: VoyagesService) {}

    @ApiOperation({
        summary: "Submit voyage project (end of voyage)",
        description:
            "-- Only one submission allowed per team. --<br><br>" +
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
        description: "The voyage project has been successfully Submitted.",
        type: CheckinSubmissionResponse,
        isArray: true,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description:
            "request body data error, e.g. invalid teamId, missing question id, missing response inputs",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "User is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "User is not in the team specified in the body",
        type: ForbiddenErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: "The team has already submitted the voyage project.",
        type: ConflictErrorResponse,
    })
    @Post("/submit-project")
    async submitVoyageProject(
        @Request() req: CustomRequest,
        @Body(new FormInputValidationPipe())
        createVoyageProjectSubmission: CreateVoyageProjectSubmissionDto,
    ) {
        return this.voyagesService.submitVoyageProject(
            req,
            createVoyageProjectSubmission,
        );
    }
}
