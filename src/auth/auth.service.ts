import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as crypto from "crypto";
import { SignupDto } from "./dto/signup.dto";
import { comparePassword, hashPassword } from "../utils/auth";
import {
    sendAttemptedRegistrationEmail,
    sendPasswordResetEmail,
    sendSignupVerificationEmail,
} from "../utils/emails/sendEmail";
import { ResendEmailDto } from "./dto/resend-email.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { ResetPasswordRequestDto } from "./dto/reset-password-request.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import * as process from "process";
import { AT_MAX_AGE, RT_MAX_AGE } from "../global/constants";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) {}

    private readonly logger = new Logger(AuthService.name);

    // tokens for email verification, forget password
    private generateToken = (userId: string) => {
        const randomString = crypto.randomBytes(64).toString("base64url");
        const payload = {
            sub: randomString,
            userId,
        };
        return this.jwtService.sign(payload, { expiresIn: "1h" });
    };

    // access token and refresh token
    private generateAtRtTokens = async (payload: object) => {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.AT_SECRET,
                expiresIn: AT_MAX_AGE,
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.RT_SECRET,
                expiresIn: RT_MAX_AGE,
            }),
        ]);
        return {
            access_token: at,
            refresh_token: rt,
        };
    };

    private hashJWT = (jwt) => {
        return crypto.createHash("sha256").update(jwt).digest("hex");
    };

    private updateRtHash = async (userId: string, rt: string) => {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: this.hashJWT(rt),
            },
        });
    };

    /**
     * Checks user email/username match database - for passport
     */
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            // no user found, but not revealing that user account does not exist in the server
            throw new BadRequestException(
                `Login failed. Invalid email and/or password.`,
            );
        }
        const isPasswordMatch = await comparePassword(password, user.password);
        if (user && isPasswordMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        const tokens = await this.generateAtRtTokens(payload);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async refresh(user: any) {
        const userInDb = await this.prisma.user.findUnique({
            where: {
                id: user.userId,
            },
        });
        if (!userInDb) throw new ForbiddenException();

        const rtMatch =
            this.hashJWT(user.refreshToken) === userInDb.refreshToken;

        // token not found, but token is a valid token: possibly stolen old token
        // invalidate user refresh token in the database, and do not issue new tokens
        if (!rtMatch) {
            await this.prisma.user.update({
                where: {
                    id: user.userId,
                },
                data: {
                    refreshToken: null,
                },
            });
            throw new ForbiddenException();
        }

        const payload = { email: user.email, sub: user.userId };
        const tokens = await this.generateAtRtTokens(payload);
        await this.updateRtHash(user.userId, tokens.refresh_token);
        return tokens;
    }

    async revokeRefreshToken(body?: any): Promise<void> {
        const { userId, email } = body;

        if (userId && email)
            throw new BadRequestException(
                "Please provide either userId or email, not both",
            );

        if (userId) {
            await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    refreshToken: null,
                },
            });
        } else if (email) {
            await this.prisma.user.update({
                where: {
                    email: email,
                },
                data: {
                    refreshToken: null,
                },
            });
        } else {
            throw new NotFoundException({
                statusCode: 404,
                message: "User not found",
            });
        }
    }

    async logout(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.RT_SECRET,
            });
            if (!payload) {
                throw new BadRequestException("refresh token error");
            }
            await this.prisma.user.update({
                where: {
                    id: payload.sub,
                    refreshToken: {
                        not: null,
                    },
                },
                data: {
                    refreshToken: null,
                },
            });
        } catch (e) {
            if (e.name === "JsonWebTokenError") {
                throw new UnauthorizedException("Malformed refresh token");
            }
            throw e;
        }
    }

    async signup(signupDto: SignupDto) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: signupDto.email,
                    password: await hashPassword(signupDto.password),
                },
            });
            const token = this.generateToken(user.id);
            await this.prisma.emailVerificationToken.create({
                data: {
                    userId: user.id,
                    token,
                },
            });
            await sendSignupVerificationEmail(signupDto.email, token);
            return {
                message: "Signup Success.",
                statusCode: 200,
            };
        } catch (e) {
            if (e.code === "P2002") {
                // user with this email exist
                this.logger.debug(
                    `[Auth/Signup]: User with email ${signupDto.email} already registered`,
                );
                const user = await this.prisma.user.findUnique({
                    where: { email: signupDto.email },
                });
                // if user account is not activated - send another email (replace old token), also update the password
                if (!user.emailVerified) {
                    const token = this.generateToken(user.id);
                    await this.prisma.emailVerificationToken.upsert({
                        where: {
                            userId: user.id,
                        },
                        update: {
                            token,
                        },
                        create: {
                            userId: user.id,
                            token,
                        },
                    });
                    await this.prisma.user.update({
                        where: {
                            id: user.id,
                        },
                        data: {
                            password: await hashPassword(signupDto.password),
                        },
                    });
                    this.logger.debug(
                        `[Auth/Signup]: User account ${signupDto.email} is not verified, resending verification email.`,
                    );
                    await sendSignupVerificationEmail(signupDto.email, token);
                } else {
                    this.logger.debug(
                        `[Auth/Signup]: Email ${signupDto.email} already verified. Sending "attempt registration" email.`,
                    );
                    await sendAttemptedRegistrationEmail(signupDto.email);
                }
            } else {
                this.logger.debug(`[Auth/Signup]: Other signup errors: ${e}`);
            }
            return {
                message: "Signup Success.",
                statusCode: 200,
            };
        }
    }

    /**
     *
     * Current assumption is, based on the auth flow on figma, frontend will only show the link if
     * 1. user is signed up, but
     * 2. not verified
     */
    async resendEmail(resendEmailDto: ResendEmailDto) {
        const user = await this.usersService.findUserByEmail(
            resendEmailDto.email,
        );
        if (!user) {
            // user does not exist, has not signed up previously
            // should not happen under the assumption
            this.logger.debug("[Auth/Resend-email]: User does not exist");
        } else if (user.emailVerified) {
            // user email has already verified
            // should not happen under the assumption
            this.logger.debug("[Auth/Resend-email]: Email already verified");
        } else {
            // user not verified - resend email
            const token = this.generateToken(user.id);
            await this.prisma.emailVerificationToken.upsert({
                where: {
                    userId: user.id,
                },
                create: {
                    userId: user.id,
                    token,
                },
                update: {
                    token,
                },
            });
            await sendSignupVerificationEmail(resendEmailDto.email, token);
            return {
                message: "Email successfully re-sent",
                statusCode: 200,
            };
        }
    }

    async verifyEmail(verifyEmailDto: VerifyEmailDto) {
        try {
            const payload = await this.jwtService.verifyAsync(
                verifyEmailDto.token,
            );
            if (!payload.userId) {
                throw new UnauthorizedException("Invalid token");
            }
            const user = await this.usersService.findUserById(payload.userId);
            if (!user) {
                // user does not exist, has not signed up previously,
                // they should not have gotten an email with the token
                this.logger.debug(
                    `[Auth/Email verification]: User ${payload.userId} does not exist`,
                );
                throw new UnauthorizedException(
                    `User ${payload.userId} does not exist.`,
                );
            }
            if (user.emailVerified) {
                // user email has already verified, just return the default status
                // this should not happen, as token is single use
                this.logger.debug(
                    `[Auth/Email verification]: Email ${user.email} already verified`,
                );
            } else {
                // user not verified - verify it, and delete the token
                const tokenInDb =
                    await this.prisma.emailVerificationToken.findUnique({
                        where: {
                            userId: user.id,
                        },
                    });
                if (!tokenInDb) {
                    // this should not really happen, unless it's a really old token, and got deleted
                    throw new UnauthorizedException(
                        "[Auth/Email verification]: Error - Token not in database.",
                    );
                }
                if (verifyEmailDto.token !== tokenInDb.token) {
                    throw new UnauthorizedException("Token mismatch");
                } else {
                    // set user emailVerified status to true, and delete the token
                    await this.prisma.$transaction([
                        this.prisma.user.update({
                            where: {
                                email: user.email,
                            },
                            data: {
                                emailVerified: true,
                            },
                        }),
                        this.prisma.emailVerificationToken.delete({
                            where: {
                                userId: user.id,
                            },
                        }),
                    ]);
                }
            }
            return {
                message: "Email successfully verified",
                statusCode: 200,
            };
        } catch (e) {
            if (e.name === "JsonWebTokenError") {
                throw new UnauthorizedException("Malformed Token");
            } else if (e.name === "TokenExpiredError") {
                throw new UnauthorizedException("Token has expired.");
            } else {
                this.logger.debug(`Email verification error: ${e.name}`);
                throw e;
            }
        }
    }

    /**
     *
     * Note: this will not respond with success/fail status due to privacy reason
     */
    async resetPasswordRequest(
        passwordResetRequestDto: ResetPasswordRequestDto,
    ) {
        const user = await this.usersService.findUserByEmail(
            passwordResetRequestDto.email,
        );

        if (!user) {
            // no user found with the email
            this.logger.debug(
                `[Auth/PasswordResetRequest]: No user (email: ${passwordResetRequestDto.email}) found in the database`,
            );
        } else {
            const token = this.generateToken(user.id);
            await this.prisma.resetToken.upsert({
                where: {
                    userId: user.id,
                },
                update: {
                    token,
                },
                create: {
                    userId: user.id,
                    token,
                },
            });
            await sendPasswordResetEmail(passwordResetRequestDto.email, token);
        }
        return {
            message:
                "Password reset email sent if you have an account with us.",
            statusCode: 200,
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        try {
            const payload = await this.jwtService.verifyAsync(
                resetPasswordDto.token,
            );
            if (!payload.userId) {
                throw new UnauthorizedException("Invalid token");
            }
            const user = await this.usersService.findUserById(payload.userId);
            if (!user) {
                this.logger.debug(
                    `[Auth/Reset password]: User ${payload.userId} does not exist`,
                );
                throw new UnauthorizedException(
                    `User ${payload.userId} does not exist.`,
                );
            }
            const tokenInDb = await this.prisma.resetToken.findUnique({
                where: {
                    userId: user.id,
                },
            });
            if (!tokenInDb) {
                throw new UnauthorizedException("Token not in database.");
            }
            if (resetPasswordDto.token !== tokenInDb.token) {
                throw new UnauthorizedException("Token mismatch");
            }
            await this.prisma.$transaction([
                this.prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        password: await hashPassword(resetPasswordDto.password),
                    },
                }),
                this.prisma.resetToken.delete({
                    where: {
                        userId: user.id,
                    },
                }),
            ]);
            return {
                message: "Password successfully reset",
                statusCode: 200,
            };
        } catch (e) {
            this.logger.debug(`[Auth/Reset Password]: error: ${e}`);
            if (e.name === "TokenExpiredError") {
                throw new UnauthorizedException("Reset token expired");
            }
            if (e.name === "JsonWebTokenError") {
                throw new UnauthorizedException("Malformed token");
            }
            throw e;
        }
    }
}
