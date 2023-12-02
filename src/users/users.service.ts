import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    private fullUserDetailSelect = {
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
                abbreviation: true,
                description: true,
            },
        },
        countryCode: true,
        timezone: true,
        comment: true,
        voyageTeamMembers: {
            select: {
                id: true,
                voyageTeam: {
                    select: {
                        id: true,
                        name: true,
                        tier: {
                            select: {
                                name: true,
                                description: true,
                            },
                        },
                    },
                },
                voyageRole: {
                    select: {
                        name: true,
                        description: true,
                    },
                },
                status: true,
                hrPerSprint: true,
                teamTechStackItemVotes: {
                    select: {
                        id: true,
                        teamTech: {
                            select: {
                                id: true,
                                name: true,
                                category: {
                                    select: {
                                        name: true,
                                        description: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };

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
            select: this.fullUserDetailSelect,
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
            select: this.fullUserDetailSelect,
        });

        if (!user) {
            throw new NotFoundException(`User (email: ${email} not found`);
        }

        return user;
    }
}
