import { PartialType } from '@nestjs/swagger';
import { CreateSprintDto } from './create-sprint.dto';

export class UpdateSprintDto extends PartialType(CreateSprintDto) {}
