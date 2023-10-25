import {Controller, Post, Request, UseGuards} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {LocalAuthGuard} from "./local-auth-guard";

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return req.user
    }
}
