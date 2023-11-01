import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateResourceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @IsUrl()
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
