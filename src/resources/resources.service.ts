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
        addedBy: userId,
      },
    });
  }

  findAll(teamId) {
    return this.prisma.teamResource.findFirst({
      where: { teamId: teamId },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(teamMemberId: number, resourceId: number, updateResourceDto: UpdateResourceDto) {
    const resourceToUpdate = this.prisma.teamResource.findOne({
      where: { resourceId: resourceId },
    });

    if (resourceToUpdate.teamMemberId !== userId)
      return { error: 'You do not have permission to update this resource' }

    return this.prisma.teamResources.update({
      where: { resourceId: resourceId },
      data: updateResourceDto,
    });
  }

  remove(teamMemberId: number, resourceId: number) {
    const resourceToRemove = this.prisma.teamResource.findOne({
      where: { resourceId: resourceId },
    });

    if (resourceToRemove.teamMemberId !== userId)
      return { error: 'You do not have permission to delete this resource' }

    return this.prisma.teamResources.delete({
      where: { resourceId: resourceId },
    });
  }
}
