import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateResourceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    url: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;
}
