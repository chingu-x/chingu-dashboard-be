import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { ResendEmailDto } from "./dto/resend-email.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import {
    BadRequestErrorResponse,
    ForbiddenErrorResponse,
    LoginUnauthorizedErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";
import {
    LoginResponse,
    LogoutResponse,
    RefreshResponse,
} from "./auth.response";
import { GenericSuccessResponse } from "../global/responses/shared";
import { ResetPasswordRequestDto } from "./dto/reset-password-request.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtRefreshAuthGuard } from "./guards/jwt-rt-auth.guard";
import { Public } from "../global/decorators/public.decorator";
import { AT_MAX_AGE, RT_MAX_AGE } from "../global/constants";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({
        summary: "Public Route: Signup, and send a verification email",
        description:
            "Please use a 'real' email if you want to receive a verification email.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            "Signup Success. User created, and verification email sent.",
        type: GenericSuccessResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "invalid email, password",
        type: BadRequestErrorResponse,
    })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post("signup")
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @ApiOperation({
        summary: "Resend the verification email",
        description:
            "Please use a 'real' email if you want to receive a verification email.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Email successfully re-sent",
        type: GenericSuccessResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized",
        type: UnauthorizedErrorResponse,
    })
    @HttpCode(HttpStatus.OK)
    @Post("resend-email")
    async resendVerificationEmail(@Body() resendEmailDto: ResendEmailDto) {
        return this.authService.resendEmail(resendEmailDto);
    }

    @ApiOperation({
        summary: "Verifies the users email",
        description: "Using a token sent to their email when sign up",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Email verified successfully",
        type: GenericSuccessResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            "Token error - e.g. malformed token, or expired token. <br> " +
            "Specific errors will be returned in <code>res.message</code>",
        type: UnauthorizedErrorResponse,
    })
    @HttpCode(HttpStatus.OK)
    @Post("verify-email")
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto);
    }

    @ApiOperation({
        summary:
            "Public Route: When a user logs in, sets access token and refresh token (http cookies).",
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
        type: LoginUnauthorizedErrorResponse,
    })
    @UseGuards(LocalAuthGuard)
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("login")
    async login(
        @Body() body: LoginDto,
        @Request() req,
        @Res({ passthrough: true }) res,
    ) {
        const { access_token, refresh_token } = await this.authService.login(
            req.user,
        );
        res.cookie("access_token", access_token, {
            maxAge: AT_MAX_AGE * 1000,
            httpOnly: true,
            secure: true,
        });
        res.cookie("refresh_token", refresh_token, {
            maxAge: RT_MAX_AGE * 1000,
            httpOnly: true,
            secure: true,
        });
        res.status(HttpStatus.OK).send({ message: "Login Success" });
    }

    @ApiOperation({
        summary:
            "Bypass access token jwt guard. Refresh an access token, with a valid refresh token in cookies",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Refresh token is successfully refreshed",
        type: RefreshResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "JWT token error",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description:
            "No user found in the database, maybe a tempered jwt token",
        type: ForbiddenErrorResponse,
    })
    @HttpCode(HttpStatus.OK)
    @Public()
    @UseGuards(JwtRefreshAuthGuard)
    @Post("refresh")
    async refresh(@Request() req, @Res({ passthrough: true }) res) {
        const cookies = req.cookies;

        if (!cookies?.refresh_token)
            throw new BadRequestException("No Refresh Token");

        const { access_token, refresh_token } = await this.authService.refresh(
            req.user,
        );

        res.cookie("access_token", access_token, {
            maxAge: AT_MAX_AGE * 1000,
            httpOnly: true,
            secure: true,
        });
        res.cookie("refresh_token", refresh_token, {
            maxAge: RT_MAX_AGE * 1000,
            httpOnly: true,
            secure: true,
        });
        res.status(HttpStatus.OK).send({ message: "Refresh Success" });
    }

    @ApiOperation({
        summary:
            "When a user logs out, access and refresh tokens are cleared from cookies, refresh token is set to null in the database.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            "User successfully logs out, access and refresh tokens in cookies is removed.",
        type: LogoutResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request, e.g. missing a required cookie",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "no access token (i.e. not logged in)",
        type: UnauthorizedErrorResponse,
    })
    @UseGuards(JwtAuthGuard)
    @Post("logout")
    async logout(@Request() req, @Res({ passthrough: true }) res) {
        const cookies = req.cookies;

        if (!cookies?.refresh_token)
            throw new BadRequestException("No Refresh Token");

        await this.authService.logout(cookies.refresh_token);

        res.status(HttpStatus.OK)
            .clearCookie("access_token")
            .clearCookie("refresh_token")
            .json({ message: "Logout Success" });
    }

    @ApiOperation({
        summary:
            "Public route: Request a password reset - email with password reset link (if the account exists)",
        description:
            "Please use a 'real' email if you want to receive a password reset email.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            "Password reset email successfully sent (if the user account exist)",
        type: GenericSuccessResponse,
    })
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("reset-password/request")
    async resetPasswordRequest(
        @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
    ) {
        return this.authService.resetPasswordRequest(resetPasswordRequestDto);
    }

    @ApiOperation({
        summary: "Public route: Reset user password",
        description:
            "The reset token is emailed to them when the request a password reset.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Password reset email successfully sent",
        type: GenericSuccessResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            "Token error - e.g. malformed token, or expired token. <br> " +
            "Specific errors will be returned in <code>res.message</code>",
        type: UnauthorizedErrorResponse,
    })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post("reset-password/")
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}
