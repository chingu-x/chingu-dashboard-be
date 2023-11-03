import { Controller, Post, Request, Res, UseGuards } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "./local-auth-guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post("login")
    @ApiBody({
        type: LoginDto,
    })
    async login(@Request() req, @Res({ passthrough: true }) res) {
        const access_token = await this.authService.login(req.user);
        res.cookie("access_token", access_token.access_token, {
            expires: new Date(Date.now() + 60 * 60 * 7 * 24),
            httpOnly: true,
            secure: true,
        });
        return access_token;
    }

    @Post("logout")
    async logout(@Res({ passthrough: true }) res) {
        res.clearCookie("access_token");
        return {};
    }
}
