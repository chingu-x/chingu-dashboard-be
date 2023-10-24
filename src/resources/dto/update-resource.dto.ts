import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  @ApiProperty()
  url: string;

  @ApiProperty()
  title: string;
}
