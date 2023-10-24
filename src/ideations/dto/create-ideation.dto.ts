import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, } from 'class-validator';


export class CreateIdeationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsString()
    @ApiProperty()
    description: string;

    @IsString()
    @ApiProperty()
    vision: string;
}
