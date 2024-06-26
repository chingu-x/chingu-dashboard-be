import { Controller, HttpStatus, Put, Res } from "@nestjs/common";
import { DevelopmentService } from "./development.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { ReSeedSuccessResponse } from "./development.response";
import {
    ServerErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";

@Controller("development")
@ApiTags("Development")
export class DevelopmentController {
    constructor(private readonly developmentService: DevelopmentService) {}

    @ApiOperation({
        summary: "Reseed the database",
        description:
            "It will take a while, maybe minutes). Then you'll be logged out.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully reseeded the database",
        type: ReSeedSuccessResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "unauthorized access - not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Reseeding failed.",
        type: ServerErrorResponse,
    })
    @Put("database/reseed")
    reseedDatabase(@Res() res: Response) {
        return this.developmentService.reseedDatabase(res);
    }
}
