import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { DeleteResourceDto } from "./dto/delete-resource.dto";

@Injectable()
export class ResourcesService {
    constructor(private prisma: PrismaService) {}

    async createNewResource(
        createResourceDto: CreateResourceDto,
        teamMemberId: number,
    ) {
        // check if this team has already added this resource's URL
        const teamMember = await this.prisma.voyageTeamMember.findUnique({
            where: {
                id: teamMemberId,
            },
            select: {
                voyageTeamId: true,
            },
        });

        const existingResource = await this.prisma.teamResource.findFirst({
            where: {
                url: createResourceDto.url,
                addedBy: {
                    voyageTeam: {
                        id: teamMember.voyageTeamId,
                    },
                },
            },
        });

        if (existingResource)
            throw new BadRequestException("URL already exists for this team");

        return this.prisma.teamResource.create({
            data: {
                ...createResourceDto,
                teamMemberId,
            },
        });
    }

    async findAllResources(teamId: number) {
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
        resourceId: number,
        updateResourceDto: UpdateResourceDto,
    ) {
        const { url, title, userId } = updateResourceDto;

        // check if logged in user's id matches the userId that created this resource
        await this.checkAuth(resourceId, userId);

        return this.prisma.teamResource.update({
            where: { id: resourceId },
            data: {
                url,
                title,
            },
        });
    }

    async removeResource(
        resourceId: number,
        deleteResourceDto: DeleteResourceDto,
    ) {
        const { userId } = deleteResourceDto;

        // check if logged in user's id matches the userId that created this resource
        await this.checkAuth(resourceId, userId);

        try {
            return this.prisma.teamResource.delete({
                where: { id: resourceId },
            });
        } catch {
            throw new BadRequestException("Resource deletion failed");
        }
    }

    private async checkAuth(resourceId, userId) {
        const resourceToModify = await this.prisma.teamResource.findUnique({
            where: { id: resourceId },
            include: {
                addedBy: {
                    select: {
                        member: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        if (!resourceToModify)
            throw new NotFoundException("Resource doesn't exist");

        if (resourceToModify.addedBy.member.id !== userId)
            throw new UnauthorizedException();
    }
}
