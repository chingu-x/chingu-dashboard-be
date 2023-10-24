import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, } from 'class-validator';
import { PartialType } from "@nestjs/swagger";
import { CreateIdeationDto } from "./create-ideation.dto";

export class UpdateIdeationDto extends PartialType(CreateIdeationDto) {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

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
