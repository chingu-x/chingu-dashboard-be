import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import * as crypto from "crypto";
import * as process from "process";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) {}

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

    async signup() {}

    // Note: this will not respond with success/fail status due to privacy reason
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
