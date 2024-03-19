import {
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
} from "@nestjs/common";
import { FormsService } from "./forms.service";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FormResponse } from "./forms.response";
import {
    ForbiddenErrorResponse,
    NotFoundErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";

import { AppRoles } from "../auth/auth.roles";
import { Roles } from "../global/decorators/roles.decorator";

@Controller("forms")
@ApiTags("Forms")
export class FormsController {
    constructor(private readonly formsService: FormsService) {}

    @Get()
    @ApiOperation({
        summary: "[Roles: admin] gets all forms from the database",
        description:
            "Returns all forms details with questions. <br>" +
            "This is currently for development purpose, or admin in future",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets the forms from the database",
        type: FormResponse,
        isArray: true,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "forbidden - user does not have the required permission",
        type: ForbiddenErrorResponse,
    })
    @Roles(AppRoles.Admin)
    getAllForms() {
        return this.formsService.getAllForms();
    }

    @Get(":formId")
    @ApiOperation({
        summary: "Gets a form with questions given a form ID",
        description:
            "Returns form details of a form, with questions. <br>" +
            "This is currently for development purpose, or admin in future",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            "Successfully gets the form (with a given formId) from the database",
        type: FormResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Invalid Form ID (FormId does not exist).",
        type: NotFoundErrorResponse,
    })
    @ApiParam({
        name: "formId",
        required: true,
        description: "form ID",
        example: 1,
    })
    getFormById(@Param("formId", ParseIntPipe) formId: number) {
        return this.formsService.getFormById(formId);
    }
}
