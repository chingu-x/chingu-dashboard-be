import {
    BadRequestException,
    Controller,
    Get,
    HttpStatus,
    Param,
    Request,
    UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
    FullUserResponse,
    PrivateUserResponse,
    UserResponse,
} from "./users.response";
import {
    BadRequestErrorResponse,
    NotFoundErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";
import { isEmail, isUUID } from "class-validator";

@Controller("users")
@ApiTags("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({
        summary: "Gets all users.",
        description: "This endpoint is for development/admin purpose.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully gets all users in the database",
        isArray: true,
        type: UserResponse,
    })
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @ApiOperation({
        summary: "Gets a logged in users detail via userId:uuid in jwt token.",
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get("me")
    getProfile(@Request() req) {
        return this.usersService.getPrivateUserProfile(req.user.userId);
    }

    @ApiOperation({
        summary: "Gets a user with full details given a userId (uuid).",
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
    @ApiParam({
        name: "userId",
        required: true,
        description: "userId (uuid)",
        example: "6bd33861-04c0-4270-8e96-62d4fb587527",
    })
    @Get("id/:userId")
    getUserDetailsById(@Param("userId") userId: string) {
        if (!isUUID(userId))
            throw new BadRequestException(`${userId} is not a valid UUID.`);
        return this.usersService.getUserDetailsById(userId);
    }

    @ApiOperation({
        summary: "Gets a user with full details given an email.",
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
        description: "Given email is not a valid email.",
        type: BadRequestErrorResponse,
    })
    @ApiParam({
        name: "email",
        required: true,
        description: "email",
        example: "jessica.williamson@gmail.com",
    })
    @Get("email/:email")
    getUserDetailsByEmail(@Param("email") email: string) {
        if (!isEmail(email))
            throw new BadRequestException(`${email} is not a valid Email.`);
        return this.usersService.getUserDetailsByEmail(email);
    }
}
