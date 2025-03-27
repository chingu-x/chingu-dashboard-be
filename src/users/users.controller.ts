import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Request,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { FullUserResponse, PrivateUserResponse } from "./users.response";
import {
    BadRequestErrorResponse,
    ForbiddenErrorResponse,
    NotFoundErrorResponse,
    UnauthorizedErrorResponse,
} from "@/global/responses/errors";
import { Unverified } from "@/global/decorators/unverified.decorator";
import { isUUID } from "class-validator";
import { UserLookupByEmailDto } from "./dto/lookup-user-by-email.dto";
import { CheckAbilities } from "@/global/decorators/abilities.decorator";
import { Action } from "@/ability/ability.factory/ability.factory";
import { CustomRequest } from "@/global/types/CustomRequest";

@Controller("users")
@ApiTags("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({
        summary: "[Roles: Admin] Gets all users.",
        description: "This endpoint is for development/admin purpose.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets all users in the database",
        isArray: true,
        type: FullUserResponse,
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
    @CheckAbilities({ action: Action.Manage, subject: "all" })
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @ApiOperation({
        summary:
            "Gets a logged in users own detail via userId:uuid in jwt token.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets user's own details",
        type: PrivateUserResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "User is not logged in",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "User not found",
        type: NotFoundErrorResponse,
    })
    @Unverified()
    @Get("me")
    getProfile(@Request() req: CustomRequest) {
        return this.usersService.getPrivateUserProfile(req.user.userId);
    }

    @ApiOperation({
        summary:
            "[Roles: Admin] Gets a user with full details given a userId (uuid).",
        description: "This is currently only for development/admin",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets the full user detail given a userId",
        isArray: true,
        type: FullUserResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "User with the given userId not found ",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "UserId is not a valid UUID",
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
        name: "userId",
        required: true,
        description: "userId (uuid)",
        example: "6bd33861-04c0-4270-8e96-62d4fb587527",
    })
    @CheckAbilities({ action: Action.Manage, subject: "all" })
    @Get("/:userId")
    getUserDetailsById(@Param("userId") userId: string) {
        if (!isUUID(userId))
            throw new BadRequestException(`${userId} is not a valid UUID.`);
        return this.usersService.getUserDetailsById(userId);
    }

    @ApiOperation({
        summary: "[Roles: Admin] Gets a user with full details given an email.",
        description: "This is currently only for development/admin",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets the full user detail given an email.",
        isArray: true,
        type: FullUserResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "User with the given email not found.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Given email is not in a valid email syntax.",
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
    @CheckAbilities({ action: Action.Manage, subject: "all" })
    @HttpCode(200)
    @Post("/lookup-by-email")
    async getUserDetailsByEmail(
        @Body() userLookupByEmailDto: UserLookupByEmailDto,
    ) {
        const userDetails =
            await this.usersService.getUserDetailsByEmail(userLookupByEmailDto);
        if (!userDetails) {
            throw new NotFoundException(`User not found`);
        }
        return userDetails;
    }

    @ApiOperation({
        summary:
            "[Permission: All registered users, can be unverified] Gets more information from the user after the initial registration",
        description:
            "User submits a form containing more information such as their name, country, goals, etc, using this endpoint. " +
            "<br/>This is part of the requirement for participating in most Chingu services like voyages",
    })
    @Post("/application")
    async submitUserApplication() {
        return this.usersService.submitUserApplication();
    }
}
