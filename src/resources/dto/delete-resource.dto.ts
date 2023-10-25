import { PartialType } from "@nestjs/mapped-types";
import { CreateResourceDto } from "./create-resource.dto";
import { ApiProperty } from "@nestjs/swagger";

export class DeleteResourceDto extends PartialType(CreateResourceDto) {
    @ApiProperty()
    userId: string;
}
