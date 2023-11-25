import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as crypto from "crypto";
import { SignupDto } from "./dto/signup.dto";
import { comparePassword, hashPassword } from "../utils/auth";
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

    private generateToken = () => crypto.randomBytes(64).toString("base64url");

    // Checks user email/username match database
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found.`);
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
        const token = this.generateToken();
        console.log(token);
        try {
            await this.prisma.user.create({
                data: {
                    email: signupDto.email,
                    password: await hashPassword(signupDto.password),
                    emailVerificationToken: {
                        create: {
                            token: await hashPassword(token),
                        },
                    },
                },
            });
            // TODO: uncomment this
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
        const token = this.generateToken();
        console.log(token);
        const user = await this.usersService.findUserByEmail(
            resendEmailDto.email,
        );
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
                    token: await hashPassword(token),
                },
                update: {
                    token: await hashPassword(token),
                },
            });
            // TODO: uncomment this
            // await sendSignupVerificationEmail(resendEmailDto.email, token);
        }
    }

    async verifyEmail(verifyEmailDto: VerifyEmailDto) {
        const user = await this.usersService.findUserByEmail(
            verifyEmailDto.email,
        );
        if (!user) {
            // user does not exist, has not signed up previously
            console.log("User does not exist");
        } else {
            // TODO: check if token is "Expired" by checking the updateAt time
            if (user.emailVerified) {
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
                    const isTokenMatched = await comparePassword(
                        verifyEmailDto.token,
                        tokenInDb.token,
                    );
                    console.log("isTokenMatched", isTokenMatched);
                    if (!isTokenMatched) {
                        console.log("Token mismatched");
                    } else {
                        // set user emailVerified status to true, and delete the token
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
        }
    }

    //  Note: this will not respond with success/fail status due to privacy reason
    async resetPassword(email: string) {
        const user = await this.usersService.findUserByEmail(email);

        if (!user) {
            // no user found with the email
            throw new NotFoundException("no user found.");
        }
        if (!user.emailVerified) {
            // user email is not verified
        }
        const token = await this.prisma.resetToken.findUnique({
            where: {
                userId: user.id,
            },
        });
        if (token) {
            //delete
        } else {
            const resetToken = this.generateToken();
            const hash = await hashPassword(resetToken);
            console.log(hash); // just to get rid of lint error so I can push to a remote branch
            // await this.prisma.resetToken.create({});
        }
    }
}
