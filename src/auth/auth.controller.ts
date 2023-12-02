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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "./local-auth-guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import {
    BadRequestErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";
import { LoginResponse, LogoutResponse } from "./auth.response";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({
        summary: "When a user logs in, creates jwt token.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            "User successfully authenticated, jwt token is saved in cookies",
        type: LoginResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description:
            "Account does not exist. A more generic error message " +
            "so users can't tell if the account exist or not due to privacy reason",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Login fails. Usually wrong password",
        type: UnauthorizedErrorResponse,
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
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
                secure: true,
            });
            res.status(HttpStatus.OK).send({ message: "Login Success" });
        } catch (e) {
            throw new UnauthorizedException("Login Error");
        }
    }

    @ApiOperation({
        summary: "When a user logs out, jwt token is cleared.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            "User successfully logs out, jwt token in cookies is removed.",
        type: LogoutResponse,
    })
    @Post("logout")
    async logout(@Res({ passthrough: true }) res) {
        res.status(HttpStatus.OK)
            .clearCookie("access_token")
            .json({ message: "Logout Success" });
    }
}
