import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeamResource } from '@prisma/client';

const userId = 6;

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}
  
  async createNewResource(createResourceDto: CreateResourceDto, teamMemberId: number) {  
    // check if this team has already added this resource's URL
    const teamMember = await this.prisma.voyageTeamMember.findUnique({
      where: {
        id: teamMemberId
      },
      select: {
        voyageTeamId: true
      }
    });

    const existingResource = await this.prisma.teamResource.findFirst({
      where: {
        url: createResourceDto.url,
        addedBy: { 
          voyageTeam: {
            id: teamMember.voyageTeamId
          } 
        },
      },
    });

    if (existingResource)
      throw new BadRequestException("URL already exists for this team")
    
    return this.prisma.teamResource.create({
      data: {
        ...createResourceDto, 
        teamMemberId: userId,
      },
    });
  }

  async findAllResources(teamId: number): Promise<TeamResource> | null {
    return this.prisma.teamResource.findMany({
      where: { 
        addedBy: { 
          voyageTeam: { 
            id: teamId,
          },
        }, 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateResource(resourceId: number, updateResourceDto: UpdateResourceDto) {
    const resourceToUpdate = await this.prisma.teamResource.findUnique({
      where: { id: resourceId },
    });

    if (resourceToUpdate.teamMemberId !== userId)
      throw new UnauthorizedException();

    return this.prisma.teamResource.update({
      where: { id: resourceId },
      data: updateResourceDto,
    });
  }

  async removeResource(resourceId: number) {
    const resourceToRemove = await this.prisma.teamResource.findUnique({
      where: { id: resourceId },
    });

    if (resourceToRemove.teamMemberId !== userId)
      throw new UnauthorizedException();

    return this.prisma.teamResource.delete({
      where: { id: resourceId },
    });
  }
}
