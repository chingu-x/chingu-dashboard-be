import {Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {LocalAuthGuard} from "./local-auth-guard";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./jwt-auth.guard";

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user)
    }

    // TODO: move this to user
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
