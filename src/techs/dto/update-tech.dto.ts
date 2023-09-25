import { PartialType } from '@nestjs/swagger';
import { CreateTechDto } from './create-tech.dto';

export class UpdateTechDto extends PartialType(CreateTechDto) {}
