import { PartialType } from "@nestjs/swagger";
import { CreateSoloProjectDto } from "./create-solo-project.dto";

export class UpdateSoloProjectDto extends PartialType(CreateSoloProjectDto) {}
