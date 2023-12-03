import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserEntity } from "./entities/user.entity";
import { fullUserDetailSelect } from "../global/selects/users.select";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    findUserByEmail(email: string): Promise<UserEntity | undefined> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                githubId: true,
                discordId: true,
                twitterId: true,
                linkedinId: true,
                email: true,
                gender: {
                    select: {
                        id: true,
                        abbreviation: true,
                        description: true,
                    },
                },
                countryCode: true,
                timezone: true,
                comment: true,
            },
        });
    }

    getPrivateUserProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                discordId: true,
                githubId: true,
                twitterId: true,
                linkedinId: true,
                email: true,
                countryCode: true,
                timezone: true,
            },
        });
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

        return user;
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

        return user;
    }
}
