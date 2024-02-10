import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { PrismaService } from "../prisma/prisma.service";
import { GlobalService } from "../global/global.service";
import { publicVoyageTeamUserSelect } from "../global/selects/teams.select";

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
            select: publicVoyageTeamUserSelect,
        });
    }

    async findTeamById(id: number) {
        const voyageTeam = await this.prisma.voyageTeam.findUnique({
            where: { id },
            select: publicVoyageTeamUserSelect,
        });
        if (!voyageTeam)
            throw new NotFoundException(
                `Voyage team (teamId: ${id}) does not exist.`,
            );
        return voyageTeam;
    }

    // Update voyage team member by id
    async updateTeamMemberById(
        teamId,
        req,
        updateTeamMemberDto: UpdateTeamMemberDto,
    ) {
        const uuid = req.user.userId;

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
