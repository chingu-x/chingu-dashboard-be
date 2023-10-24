import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeamResource } from '@prisma/client';

const userId = 6;

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}
  
  async create(createResourceDto: CreateResourceDto, teamMemberId: number): Promise<TeamResource> {  
    // check if this team has already added this resource
    const team = await this.prisma.voyageTeamMember.findUnique({
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
          voyageTeamId: team.voyageTeamId 
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

  async findAll(teamId: number) {
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

  async update(teamMemberId: number, resourceId: number, updateResourceDto: UpdateResourceDto) {
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

  async remove(teamMemberId: number, resourceId: number) {
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
