import { PartialType } from "@nestjs/mapped-types";
import { CreateResourceDto } from "./create-resource.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, } from 'class-validator';

export class DeleteResourceDto extends PartialType(CreateResourceDto) {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;
}
