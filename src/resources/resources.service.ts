import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}
  
  create(createResourceDto: CreateResourceDto) {
    return this.prisma.teamResource.create({
      data: createResourceDto,
    });
  }

  findAll(teamId) {
    return this.prisma.teamResource.findMany({
      where: {}
    });
  }

  update(teamMemberId: number, resourceId: number, updateResourceDto: UpdateResourceDto) {
    return this.prisma.teamResources.update({
      where: {}
    });
  }

  remove(teamMemberId: number, resourceId: number) {
    return this.prisma.teamResources.delete({

    });
  }
}
