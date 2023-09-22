import { PartialType } from "@nestjs/swagger";
import { CreateIdeationDto } from "./create-ideation.dto";

export class UpdateIdeationDto extends PartialType(CreateIdeationDto) {}
