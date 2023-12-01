import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Request,
    Res,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { LocalAuthGuard } from "./local-auth-guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({
        summary: "When a user logs in, creates jwt token.",
    })
    @ApiOkResponse({
        status: 200,
        description:
            "User successfully authenticated, jwt token is saved in cookies",
    })
    @ApiBadRequestResponse({
        status: 400,
        description:
            "Account does not exist. A more generic error message " +
            "so users can't tell if the account exist or not due to privacy reason",
    })
    @ApiUnauthorizedResponse({
        status: 401,
        description: "Login fails. Usually wrong password",
    })
    @UseGuards(LocalAuthGuard)
    @Post("login")
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
            res.status(HttpStatus.OK).send("Login Success");
        } catch (e) {
            throw new UnauthorizedException("Login Error");
        }
    }

    @ApiOperation({
        summary: "When a user logs out, jwt token is cleared.",
    })
    @ApiOkResponse({
        status: 200,
        description:
            "User successfully logs out, jwt token in cookies is removed.",
    })
    @Post("logout")
    async logout(@Res({ passthrough: true }) res) {
        res.clearCookie("access_token");
        return {};
    }
}
