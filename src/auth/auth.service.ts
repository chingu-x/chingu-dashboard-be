import {
    BadRequestException,
    Injectable,
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
import { PasswordResetRequestDto } from "./dto/password-reset-request.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) {}

    private generateToken = (userId: string) => {
        const randomString = crypto.randomBytes(64).toString("base64url");
        const payload = {
            sub: randomString,
            userId,
        };
        return this.jwtService.sign(payload, { expiresIn: "1h" });
    };

    // TODO: check if anything else needs to be in a transaction
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
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async signup(signupDto: SignupDto) {
        try {
            this.prisma.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                        email: signupDto.email,
                        password: await hashPassword(signupDto.password),
                    },
                });
                const token = this.generateToken(user.id);
                await tx.emailVerificationToken.create({
                    data: {
                        userId: user.id,
                        token,
                    },
                });
                await sendSignupVerificationEmail(signupDto.email, token);
            });
        } catch (e) {
            if (e.code === "P2002") {
                // user with this email exist
                console.log(
                    `[Auth/Signup]: User with email ${signupDto.email} already registered`,
                );
                const user = await this.prisma.user.findUnique({
                    where: { email: signupDto.email },
                });
                // if user account is not activated - send another email (replace old token)
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
                    console.log(
                        `[Auth/Signup]: User account ${signupDto.email} is not verified, resending verification email.`,
                    );
                    await sendSignupVerificationEmail(signupDto.email, token);
                } else {
                    console.log(
                        `[Auth/Signup]: Email ${signupDto.email} already verified. Sending "attempt registration" email.`,
                    );
                    await sendAttemptedRegistrationEmail(signupDto.email);
                }
            } else {
                console.log(`[Auth/Signup]: Other signup errors: ${e}`);
            }
        }
        return;
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
            console.log("[Auth/Resend-email]: User does not exist");
        } else if (user.emailVerified) {
            // user email has already verified
            // should not happen under the assumption
            console.log("[Auth/Resend-email]: Email already verified");
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
                console.log(
                    `[Auth/Email verification]: User ${payload.userId} does not exist`,
                );
                throw new UnauthorizedException("User does not exist.");
            } else {
                if (user.emailVerified) {
                    // user email has already verified, just return the default status
                    console.log(
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
                        // this should not really happen
                        throw new UnauthorizedException(
                            "[Auth/Email verification]: Error - Token not in database.",
                        );
                    } else {
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
                            return {
                                message: "Email successfully verified",
                                statusCode: 200,
                            };
                        }
                    }
                }
            }
        } catch (e) {
            if (e.name === "JsonWebTokenError") {
                throw new UnauthorizedException("Malformed Token");
            } else if (e.name === "TokenExpiredError") {
                throw new UnauthorizedException("Token has expired.");
            } else {
                console.log(`Email verification error: ${e.name}`);
                throw e;
            }
        }
    }

    /**
     *
     * Note: this will not respond with success/fail status due to privacy reason
     */
    async passwordResetRequest(
        passwordResetRequestDto: PasswordResetRequestDto,
    ) {
        const user = await this.usersService.findUserByEmail(
            passwordResetRequestDto.email,
        );

        if (!user) {
            // no user found with the email
            console.log(
                `[Auth/PasswordResetRequest]: No user (email: ${passwordResetRequestDto.email}) found in the database`,
            );
        }
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
        return {
            message: "Password reset email successfully sent",
            statusCode: 200,
        };
    }

    async passwordReset(email: string) {
        /*

        const tokenInDb = await this.prisma.resetToken.findUnique({
            where: {
                userId: user.id,
            },
        });
        if (token) {
            //delete
        } else {
            const resetToken = this.generateToken(user.id);
            const hash = await hashPassword(resetToken);
            console.log(hash); // just to get rid of lint error so I can push to a remote branch
            // await this.prisma.resetToken.create({});
        }
        
         */
    }
}
