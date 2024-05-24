import { UserLookupByEmailDto } from "./dto/lookup-user-by-email.dto";
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
            roles: user?.roles.flatMap((r) => r.role.name),
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
                    voyageTeamMembers: {
                        select: {
                            id: true,
                            voyageTeamId: true,
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
            select: {
                ...privateUserDetailSelect,
                voyageTeamMembers: {
                    select: {
                        id: true,
                        voyageTeamId: true,
                        voyageTeam: true,
                    },
                },
            },
        });
        if (!user) throw new NotFoundException("User not found");
        // get voyageTeamMemberIds
        const teamMemberIds: number[] = user.voyageTeamMembers.map(
            (teamMemberId) => teamMemberId.id,
        );
        // get voyageTeamId
        const teamIds: number[] = user.voyageTeamMembers.map(
            (voyageTeamId) => voyageTeamId.voyageTeamId,
        );
        // get sprint checkin  Ids
        const sprintCheckInIds = (
            await this.prisma.formResponseCheckin.findMany({
                where: {
                    voyageTeamMemberId: {
                        in: teamMemberIds,
                    },
                },
                select: {
                    sprintId: true,
                },
            })
        ).map((sprintCheckInId) => sprintCheckInId.sprintId);

        const projectStatusTeamIds: number[] = (
            await this.prisma.formResponseVoyageProject.findMany({
                where: {
                    voyageTeamId: {
                        in: teamIds,
                    },
                },
                select: {
                    voyageTeamId: true,
                },
            })
        ).map((projectStatusTeamId) => projectStatusTeamId.voyageTeamId);
        // update user object with sprintCheckInIds and projectStatus
        const updatedUser = {
            ...user,
            sprintCheckIn: sprintCheckInIds,
            voyageTeamMembers: user.voyageTeamMembers.map((teamMember) => {
                if (projectStatusTeamIds.includes(teamMember.voyageTeamId)) {
                    return {
                        ...teamMember,
                        voyageTeam: {
                            ...teamMember.voyageTeam,
                            projectSubmitted: true,
                        },
                    };
                }
                return teamMember;
            }),
        };

        return this.formatUser(updatedUser);
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
            throw new NotFoundException(`User (userid: ${userId}) not found`);
        }

        return this.formatUser(user);
    }

    async getUserDetailsByEmail(userLookupByEmailDto: UserLookupByEmailDto) {
        const { email } = userLookupByEmailDto;
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
            select: fullUserDetailSelect,
        });

        if (!user) {
            throw new NotFoundException(`User with ${email} not found`);
        }

        return this.formatUser(user);
    }
}
