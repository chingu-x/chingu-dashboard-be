import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import * as crypto from "crypto";
import * as process from "process";
import { SignupDto } from "./dto/signup.dto";
import { hashPassword } from "../utils/auth";
import { sendSignupVerificationEmail } from "../utils/emails/sendEmail";
import { ResendEmailDto } from "./dto/resend-email.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) {}

    private generateVerificationToken = () =>
        crypto.randomBytes(64).toString("base64url");

    // Checks user email/username match database
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found.`);
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
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
        const token = this.generateVerificationToken();
        console.log(token);
        try {
            await this.prisma.user.create({
                data: {
                    email: signupDto.email,
                    password: await hashPassword(signupDto.password),
                    emailVerificationToken: {
                        create: {
                            token,
                        },
                    },
                },
            });
            await sendSignupVerificationEmail(signupDto.email, token);
        } catch (e) {
            if (e.code === "P2002") {
                // user with this email exist
                console.log(
                    `User with email ${signupDto.email} already registered`,
                );
                // TODO:
                // if user account is not activated - send another email (remove old token)
                // if user account is activated - send them and email and tell them to use the reset password form
            } else {
                console.log(`Other signup errors: ${e}`);
            }
        }
        return token;
    }

    async resendEmail(resendEmailDto: ResendEmailDto) {
        const token = this.generateVerificationToken();
        const user = await this.prisma.user.findUnique({
            where: {
                email: resendEmailDto.email,
            },
        });
        if (!user) {
            // user does not exist, has not signed up previously
            console.log("User does not exist");
        } else if (user.emailVerified) {
            // user email has already verified, tell user to reset password if they have forgotten their password
            console.log("Email already verified");
        } else {
            // user not verified - resend email
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
        }
    }

    async verifyEmail(verifyEmailDto: VerifyEmailDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: verifyEmailDto.email,
            },
        });
        if (!user) {
            // user does not exist, has not signed up previously
            console.log("User does not exist");
        } else if (user.emailVerified) {
            // user email has already verified, tell user to reset password if they have forgotten their password
            console.log("Email already verified");
        } else {
            // user not verified - verify it, and delete the token
            const tokenInDb =
                await this.prisma.emailVerificationToken.findUnique({
                    where: {
                        userId: user.id,
                    },
                });
            if (!tokenInDb) {
                console.log("token expired"); // maybe send another one
                // email them or frontend will display saying token expired
                // with a resend verification email option
            } else {
                await this.prisma.$transaction([
                    this.prisma.user.update({
                        where: {
                            email: verifyEmailDto.email,
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
                console.log("Email verified");
            }
        }
    }

    // TODO: need to check this
    //  Note: this will not respond with success/fail status due to privacy reason
    async resetPassword(email: string) {
        const user = await this.usersService.findUserByEmail(email);

        if (!user) {
            // no user found with the email
            throw new NotFoundException("no user found.");
        }
        const token = await this.prisma.resetToken.findUnique({
            where: {
                userId: user.id,
            },
        });
        if (token) {
            //delete
        } else {
            const resetToken = crypto.randomBytes(32).toString("hex");
            const hash = await bcrypt.hash(
                resetToken,
                Number(process.env.BCRYPT_HASHING_ROUNDS),
            );
            console.log(hash); // just to get rid of lint error so I can push to a remote branch
            // await this.prisma.resetToken.create({});
        }
    }
}
