import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const userId = 1;

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}
  
  create(createResourceDto: CreateResourceDto) {
    return this.prisma.teamResource.create({
      data: {
        ...createResourceDto, 
        teamMemberId: userId,
      },
    });
  }

  // todo
  async findAll(teamId) {
    
    return this.prisma.teamResource.findMany({
      where: { teamId: teamId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(teamMemberId: number, resourceId: number, updateResourceDto: UpdateResourceDto) {
    const resourceToUpdate = await this.prisma.teamResource.findUnique({
      where: { id: resourceId },
    });

    if (resourceToUpdate.teamMemberId !== userId)
      return { error: 'You do not have permission to update this resource' }

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
      return { error: 'You do not have permission to delete this resource' }

    return this.prisma.teamResource.delete({
      where: { id: resourceId },
    });
  }
}
