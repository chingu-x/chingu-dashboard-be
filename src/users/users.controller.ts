import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("users")
@ApiTags("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({
        summary: "Gets all users.",
    })
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @ApiOperation({
        summary: "Gets a logged in users detail via userId:uuid in jwt token.",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get("me")
    getProfile(@Request() req) {
        return this.usersService.getPrivateUserProfile(req.user.userId);
    }

    @ApiOperation({
        summary: "Gets a user with full details given a userId (int).",
    })
    // full user detail, for dev purpose
    @Get(":userId")
    getUserDetailsById(@Param("userId") userId: string) {
        return this.usersService.getUserDetailsById(userId);
    }
}
