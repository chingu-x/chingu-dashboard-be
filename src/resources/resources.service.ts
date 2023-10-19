import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  create(createResourceDto: CreateResourceDto) {
    return 'This action adds a new resource';
  }

  findAll(teamId) {
    return `This action returns all resources`;
  }

  update(teamMemberId: number, resourceId: number, updateResourceDto: UpdateResourceDto) {
    return ``;
  }

  remove(teamMemberId: number, resourceId: number) {
    return ``;
  }
}
