import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { FormsService } from "./forms.service";
import {
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";

@Controller("forms")
@ApiTags("Forms")
export class FormsController {
    constructor(private readonly formsService: FormsService) {}

    @Get()
    @ApiOperation({
        summary: "gets all forms from the database",
        description:
            "Returns all forms details with questions. <br>" +
            "This is currently for development purpose, or admin in future",
    })
    @ApiOkResponse({
        status: 200,
        description: "Successfully gets the forms from the database",
    })
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
    @ApiOkResponse({
        status: 200,
        description:
            "Successfully gets the form (with a given formId) from the database",
    })
    @ApiNotFoundResponse({
        status: 404,
        description: "Invalid Form ID (FormId does not exist).",
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
