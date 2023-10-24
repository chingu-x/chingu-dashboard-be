import { ApiProperty } from "@nestjs/swagger";
import { IsString, } from 'class-validator';
import { PartialType } from "@nestjs/swagger";
import { CreateIdeationDto } from "./create-ideation.dto";

export class UpdateIdeationDto extends PartialType(CreateIdeationDto) {
    @IsString()
    @ApiProperty()
    title: string;

    @IsString()
    @ApiProperty()
    description: string;

    @IsString()
    @ApiProperty()
    vision: string;
}
