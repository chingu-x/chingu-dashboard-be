import { Injectable } from "@nestjs/common";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { PrismaService } from "../prisma/prisma.service";
import { GlobalService } from "src/global/global.service";

@Injectable()
export class TeamsService {
    constructor(
        private prisma: PrismaService,
        private readonly globalService: GlobalService,
    ) {}

    findAll() {
        return this.prisma.voyageTeam.findMany({});
    }

    findAllByVoyageId(id: number) {
        return this.prisma.voyageTeam.findMany({
            where: {
                voyageId: id,
            },
        });
    }

    findOne(id: number) {
        return this.prisma.voyageTeam.findUnique({
            where: { id },
        });
    }

    findTeamMembersByTeamId(id: number) {
        return this.prisma.voyageTeamMember.findMany({
            where: {
                voyageTeamId: id,
            },
            select: {
                member: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        discordId: true,
                        countryCode: true,
                        timezone: true,
                        email: true,
                    },
                },
                hrPerSprint: true,
                voyageRole: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    // Update voyage team member by id
    async updateTeamMemberById(
        teamId,
        req,
        updateTeamMemberDto: UpdateTeamMemberDto,
    ) {
        const uuid = req.user.userId;

        await this.globalService.validateLoggedInAndTeamMember(teamId, uuid);

        return this.prisma.voyageTeamMember.update({
            where: {
                userVoyageId: {
                    userId: uuid,
                    voyageTeamId: teamId,
                },
            },
            data: updateTeamMemberDto,
        });
    }
}
