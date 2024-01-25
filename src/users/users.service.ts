import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserEntity } from "./entities/user.entity";
import {
    fullUserDetailSelect,
    privateUserDetailSelect,
} from "../global/selects/users.select";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    private formatUser = (user) => {
        const formattedUser = {
            ...user,
            roles: user.userRole.flatMap((r) => r.role.name),
        };

        delete formattedUser.userRole;

        return formattedUser;
    };

    findUserByEmail(email: string): Promise<UserEntity | undefined> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    findUserById(id: string): Promise<UserEntity | undefined> {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async findAll() {
        const users = await this.prisma.user.findMany({
            select: fullUserDetailSelect,
        });
        return users.map((user) => this.formatUser(user));
    }

    // /me endpoint, user's own profile/data
    async getPrivateUserProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: privateUserDetailSelect,
        });

        return this.formatUser(user);
    }

    // full user detail, for dev purpose
    async getUserDetailsById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: fullUserDetailSelect,
        });

        if (!user) {
            throw new NotFoundException(`User (userid: ${userId} not found`);
        }

        return this.formatUser(user);
    }

    async getUserDetailsByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
            select: fullUserDetailSelect,
        });

        if (!user) {
            throw new NotFoundException(`User (email: ${email} not found`);
        }

        return this.formatUser(user);
    }
}
