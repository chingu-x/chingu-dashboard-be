import {Controller, Get, Param, Request, UseGuards} from "@nestjs/common";
import { UsersService } from "./users.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller("users")
@ApiTags("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('test')
    test(@Request() req) {
        console.log(req.user.userId)
        return req.user
    }

    // full user detail, for dev purpose
    @Get(":userId")
    getUserDetailsById(@Param("userId") userId: string) {
        return this.usersService.getUserDetailsById(userId);
    }




}
