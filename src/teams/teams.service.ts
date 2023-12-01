import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { PrismaService } from "../prisma/prisma.service";
import { GlobalService } from "../global/global.service";

@Injectable()
export class TeamsService {
    constructor(
        private prisma: PrismaService,
        private readonly globalService: GlobalService,
    ) {}

    findAll() {
        return this.prisma.voyageTeam.findMany({});
    }

    async findTeamsByVoyageId(id: number) {
        const voyage = await this.prisma.voyage.findUnique({
            where: { id },
        });
        if (!voyage)
            throw new NotFoundException(`Voyage with id ${id} does not exist.`);
        return this.prisma.voyageTeam.findMany({
            where: {
                voyageId: id,
            },
        });
    }

    async findTeamById(id: number) {
        const voyageTeam = await this.prisma.voyageTeam.findUnique({
            where: { id },
        });
        if (!voyageTeam)
            throw new NotFoundException(
                `Voyage team (teamId: ${id}) does not exist.`,
            );
        return voyageTeam;
    }

    findTeamMembersByTeamId(id: number) {
        return this.prisma.voyageTeamMember.findMany({
            where: {
                voyageTeamId: id,
            },
            select: {
                id: true,
                member: {
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
                        countryCode: true,
                        timezone: true,
                        comment: true,
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
