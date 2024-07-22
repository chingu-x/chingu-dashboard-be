import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { PrismaService } from "../prisma/prisma.service";
import { CustomRequest } from "../global/types/CustomRequest";
import { manageOwnVoyageTeamWithIdParam } from "../ability/conditions/voyage-teams.ability";
import { manageOwnResourceById } from "../ability/conditions/resource.ability";

@Injectable()
export class ResourcesService {
    constructor(private prisma: PrismaService) {}

    async createNewResource(
        req: CustomRequest,
        createResourceDto: CreateResourceDto,
        teamId: number,
    ) {
        // make sure teamId exists
        await this.checkTeamExists(teamId);

        manageOwnVoyageTeamWithIdParam(req.user, teamId);
        const { url, title } = createResourceDto;

        const teamMemberId = req.user.voyageTeams.find(
            (vt) => vt.teamId === teamId,
        )?.memberId;

        const existingResource = await this.prisma.teamResource.findFirst({
            where: {
                url: url,
                addedBy: {
                    voyageTeam: {
                        id: teamId,
                    },
                },
            },
        });

        if (existingResource)
            throw new BadRequestException("URL already exists for this team");

        return this.prisma.teamResource.create({
            data: {
                url,
                title,
                teamMemberId: teamMemberId,
            },
        });
    }

    async findAllResources(req: CustomRequest, teamId: number) {
        // make sure teamId exists
        await this.checkTeamExists(teamId);

        // make sure user is a member of this team
        manageOwnVoyageTeamWithIdParam(req.user, teamId);

        return this.prisma.teamResource.findMany({
            where: {
                addedBy: {
                    voyageTeam: {
                        id: teamId,
                    },
                },
            },
            include: {
                addedBy: {
                    select: {
                        member: {
                            select: {
                                firstName: true,
                                lastName: true,
                                id: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async updateResource(
        req: CustomRequest,
        resourceId: number,
        updateResourceDto: UpdateResourceDto,
    ) {
        const { url, title } = updateResourceDto;

        // check for own team permissions
        await manageOwnResourceById(req.user, resourceId);

        try {
            return this.prisma.teamResource.update({
                where: { id: resourceId },
                data: {
                    url,
                    title,
                },
            });
        } catch {
            throw new BadRequestException("Resource update failed");
        }
    }

    async removeResource(req: CustomRequest, resourceId: number) {
        await manageOwnResourceById(req.user, resourceId);

        try {
            return this.prisma.teamResource.delete({
                where: { id: resourceId },
            });
        } catch {
            throw new BadRequestException("Resource deletion failed");
        }
    }

    private async checkTeamExists(teamId: number) {
        const voyageTeam = await this.prisma.voyageTeam.findUnique({
            where: {
                id: teamId,
            },
        });

        if (!voyageTeam) {
            throw new NotFoundException(`Team (id: ${teamId}) doesn't exist.`);
        }
    }
}
