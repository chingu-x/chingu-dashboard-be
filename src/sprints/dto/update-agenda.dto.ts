import { PartialType } from '@nestjs/swagger';
import {CreateAgendaDto} from "./create-agenda.dto";

export class UpdateAgendaDto extends PartialType(CreateAgendaDto) {}
