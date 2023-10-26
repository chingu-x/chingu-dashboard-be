import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserEntity } from "./entities/user.entity";

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
                gender: true,
                countryCode: true,
                timezone: true,
                comment: true,
            },
        });
    }

    // full user detail, for dev purpose
    getUserDetailsById(userId: string) {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            },
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
            },
        });
    }

    getUserProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                countryCode: true,
                discordId: true,
                // add other stuff
            },
        });
    }
}
