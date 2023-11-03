import {
    Body,
    Controller,
    Post,
    Request,
    Res,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "./local-auth-guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post("login")
<<<<<<< HEAD
    async login(@Request() req, @Res({ passthrough: true }) res) {
        const access_token = await this.authService.login(req.user);
        res.cookie("access_token", access_token.access_token, {
            expires: new Date(Date.now() + 60 * 60 * 7 * 24),
            httpOnly: true,
            secure: true,
        });
        return access_token;
=======
    async login(
        @Body() body: LoginDto,
        @Request() req,
        @Res({ passthrough: true }) res,
    ) {
        try {
            const access_token = await this.authService.login(req.user);
            res.cookie("access_token", access_token.access_token, {
                expires: new Date(Date.now() + 60 * 60 * 7 * 24),
                httpOnly: true,
                secure: true,
            });
            return access_token;
        } catch (e) {
            console.log(e);
            throw new UnauthorizedException("Login Error");
        }
>>>>>>> origin/dev
    }

    @Post("logout")
    async logout(@Res({ passthrough: true }) res) {
        res.clearCookie("access_token");
        return {};
    }
}
