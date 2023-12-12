import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Param,
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
import { SignupDto } from "./dto/signup.dto";
import { ResendEmailDto } from "./dto/resend-email.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import {
    BadRequestErrorResponse,
    LoginUnauthorizedErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";
import { LoginResponse, LogoutResponse } from "./auth.response";
import { GenericSuccessResponse } from "../global/responses/shared";
import { PasswordResetRequestDto } from "./dto/password-reset-request.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({
        summary: "Signup, and send a verification email",
        description:
            "Please use a 'real' email if you want to receive a verification email.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            "Signup Success. User created, and verification email sent.",
    })
    @HttpCode(HttpStatus.OK)
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
        summary: "When a user logs in, creates jwt token.",
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
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
            res.status(HttpStatus.CREATED).send({ message: "Login Success" });
        } catch (e) {
            throw new UnauthorizedException(
                "Signup failed. Invalid email and/or password. Please try again.",
            );
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

    @ApiOperation({
        summary: "Request a password reset - email with password reset link",
        description:
            "Please use a 'real' email if you want to receive a password reset email.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Password reset email successfully sent",
        type: GenericSuccessResponse,
    })
    @HttpCode(HttpStatus.OK)
    @Post("password-reset-request")
    async passwordResetRequest(
        @Body() passwordResetRequestDto: PasswordResetRequestDto,
    ) {
        return this.authService.passwordResetRequest(passwordResetRequestDto);
    }

    @Post("password-reset")
    async passwordReset() {}
}
