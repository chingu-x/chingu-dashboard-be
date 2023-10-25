import { PartialType } from "@nestjs/mapped-types";
import { CreateResourceDto } from "./create-resource.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, } from 'class-validator';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    url: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;
}
