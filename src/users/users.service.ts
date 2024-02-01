import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    fullUserDetailSelect,
    privateUserDetailSelect,
} from "../global/selects/users.select";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    private formatUser = (user) => {
        return {
            ...user,
            roles: user.roles.flatMap((r) => r.role.name),
        };
    };

    findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    findUserById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async getUserRolesById(userId: string) {
        return this.formatUser(
            await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    roles: {
                        select: {
                            role: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            }),
        );
    }

    async findAll() {
        const users = await this.prisma.user.findMany({
            select: fullUserDetailSelect,
        });
        return users.map((user) => this.formatUser(user));
    }

    // /me endpoint, user's own profile/data
    // TODO: add error handling for invalid id (invalid uuid)
    async getPrivateUserProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: privateUserDetailSelect,
        });

        if (!user) throw new NotFoundException("User not found");
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
