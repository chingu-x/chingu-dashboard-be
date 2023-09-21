import { Injectable } from '@nestjs/common';
import { CreateIdeationDto } from './dto/create-ideation.dto';
import { UpdateIdeationDto } from './dto/update-ideation.dto';

@Injectable()
export class IdeationService {
  create(createIdeationDto: CreateIdeationDto) {
    return 'This action adds a new ideation';
  }

  findAll() {
    return `This action returns all ideation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ideation`;
  }

  update(id: number, updateIdeationDto: UpdateIdeationDto) {
    return `This action updates a #${id} ideation`;
  }

  remove(id: number) {
    return `This action removes a #${id} ideation`;
  }
}
