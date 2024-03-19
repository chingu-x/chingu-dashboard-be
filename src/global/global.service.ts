import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CustomRequest } from "./types/CustomRequest";

@Injectable()
export class GlobalService {
    constructor(private prisma: PrismaService) {}

    //verifies user is logged in by using uuid from cookie and teamId to pull a teamMember.
    // TODO: remove as it's replaced by permission guard
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

    public getVoyageTeamMemberId(req: CustomRequest, teamId: number) {
        const teamMemberId = req.user.voyageTeams.find(
            (t) => t.teamId == teamId,
        )?.memberId;
        if (!teamMemberId) {
            throw new BadRequestException(`Invalid Team Id (id: ${teamId}).`);
        }
        return teamMemberId;
    }
}
