import {Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
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

// TODO: move this to user and pull profile from db
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('profile')
    getProfile(@Request() req) {
        return this.authService.getProfile(req.user.userId)
    }
}
