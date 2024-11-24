import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
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
    NotFoundErrorResponse,
    UnauthorizedErrorResponse,
} from "@/global/responses/errors";
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
import { Public } from "@/global/decorators/public.decorator";
import { Unverified } from "@/global/decorators/unverified.decorator";
import { RevokeRTDto } from "./dto/revoke-refresh-token.dto";
import { CheckAbilities } from "@/global/decorators/abilities.decorator";
import { Action } from "@/ability/ability.factory/ability.factory";
import { CustomRequest } from "@/global/types/CustomRequest";
import { Response } from "express";
import { DiscordAuthGuard } from "./guards/discord-auth.guard";
import { AppConfigService } from "@/config/app/appConfig.service";
import { GithubAuthGuard } from "./guards/github-auth.guard";
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private appConfigService: AppConfigService,
    ) {}

    @ApiOperation({
        summary: "Public Route: Signup, and send a verification email",
        description:
            "[access]: public" +
            "<br>Note: Please use a 'real' email if you want to receive a verification email.",
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
            "[access]: unverified user, user, voyage, admin" +
            "<br>Please use a 'real' email if you want to receive a verification email." +
            "<br>response will always be 200, due to privacy reason",
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
    @Unverified()
    @Post("resend-email")
    async resendVerificationEmail(@Body() resendEmailDto: ResendEmailDto) {
        return this.authService.resendEmail(resendEmailDto);
    }

    @ApiOperation({
        summary: "Verifies the users email",
        description:
            "[access]: unverified user, user, voyager, admin" +
            "<br>Using a token sent to their email when sign up",
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
    @Unverified()
    @Post("verify-email")
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto);
    }

    @ApiOperation({
        summary:
            "Public Route: When a user logs in, sets access token and refresh token (http cookies).",
        description: "<br>[access]: public",
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
        @Request() req: CustomRequest,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.returnTokensOnLoginSuccess(req, res);
        res.status(HttpStatus.OK).send({ message: "Login Success" });
    }

    @ApiOperation({
        summary:
            "Bypass access token jwt guard. Refresh an access token, with a valid refresh token in cookies",
        description: "<br>[access]: public",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Refresh token is successfully refreshed",
        type: RefreshResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Invalid / tempered access token / no refresh token",
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
    async refresh(
        @Request() req: CustomRequest,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { access_token, refresh_token } = await this.authService.refresh(
            req.user,
        );

        this.authService.setCookie(res, access_token, refresh_token);
        res.status(HttpStatus.OK).send({ message: "Refresh Success" });
    }

    @ApiOperation({
        summary:
            "[Admin only]: Revokes user's refresh token, with a valid user id or email",
        description:
            "[access]: admin" +
            "<br>using the user's id or email, removes user's refresh token",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Refresh token successfully revoked",
        type: GenericSuccessResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "User not found.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "userId and email is provided",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "user doesn't have permission to preform operation",
        type: ForbiddenErrorResponse,
    })
    @HttpCode(HttpStatus.OK)
    @CheckAbilities({ action: Action.Manage, subject: "all" })
    @Delete("refresh/revoke")
    async revoke(@Body() body: RevokeRTDto, @Res() res: Response) {
        await this.authService.revokeRefreshToken(body);
        res.status(HttpStatus.OK).json({
            message: "User Refresh token Successfully revoke.",
            statusCode: 200,
        });
    }

    @ApiOperation({
        summary:
            "When a user logs out, access and refresh tokens are cleared from cookies, refresh token is set to null in the database.",
        description: "[access]: user, voyager, admin",
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
    @Unverified()
    @Post("logout")
    async logout(
        @Request() req: CustomRequest,
        @Res({ passthrough: true }) res: Response,
    ) {
        const cookies = req.cookies;

        if (!cookies?.refresh_token)
            throw new BadRequestException("No Refresh Token");

        await this.authService.logout(res, cookies.refresh_token);
    }

    @ApiOperation({
        summary:
            "Public route: Request a password reset - email with password reset link (if the account exists)",
        description:
            "[access]: unverified user, user, voyager, admin" +
            "<br>Please use a 'real' email if you want to receive a password reset email.",
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
            "[access]: public" +
            "<br>The reset token is emailed to them when the request a password reset.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Password reset email successfully sent",
        type: GenericSuccessResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Error in request body, e.g. missing or invalid data",
        type: BadRequestErrorResponse,
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

    @ApiOperation({
        summary: "discord oauth",
        description:
            "This does not work on swagger. Open this link from a web browser, a discord popup should appear. `{BaseURL}/api/v1/auth/discord/login` ",
    })
    @UseGuards(DiscordAuthGuard)
    @Public()
    @Get("/discord/login")
    handleDiscordLogin() {
        return;
    }

    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid code",
        type: BadRequestErrorResponse,
    })
    @UseGuards(DiscordAuthGuard)
    @Public()
    @Get("/discord/redirect")
    async handleDiscordRedirect(
        @Request() req: CustomRequest,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.returnTokensOnLoginSuccess(req, res);
        const FRONTEND_URL = this.appConfigService.FrontendUrl;
        res.redirect(`${FRONTEND_URL}`);
    }

    @ApiOperation({
        summary: "Github oauth",
        description:
            "This does not work on swagger. Open `{BaseURL}/api/v1/auth/github/login` in a browser to see the GitHub popup.",
    })
    @UseGuards(GithubAuthGuard)
    @Public()
    @Get("/github/login")
    handleGithubLogin() {
        return;
    }

    @UseGuards(GithubAuthGuard)
    @Public()
    @Get("/github/redirect")
    async handleGithubRedirect(
        @Request() req: CustomRequest,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.returnTokensOnLoginSuccess(req, res);
        const FRONTEND_URL = this.appConfigService.FrontendUrl;
        res.redirect(`${FRONTEND_URL}`);
    }
}
