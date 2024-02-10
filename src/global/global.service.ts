import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GlobalService {
    constructor(private prisma: PrismaService) {}

    //verifies user is logged in by using uuid from cookie and teamId to pull a teamMember.
    public async validateLoggedInAndTeamMember(teamId: number, uuid: any) {
        const teamMember = await this.prisma.voyageTeamMember.findFirst({
            where: {
                voyageTeamId: teamId,
                userId: uuid,
            },
            select: {
                id: true,
                userId: true,
                voyageTeamId: true,
            },
        });

        if (!teamMember) {
            throw new UnauthorizedException(
                `TeamId (id: ${teamId}) and/or loggedIn userId (id: ${uuid}) is invalid.`,
            );
        }
        return teamMember;
    }
}
