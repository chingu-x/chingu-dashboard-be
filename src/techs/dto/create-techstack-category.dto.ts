import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTechStackCategoryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "CDN" })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Host for static resources" })
    description: string;
}
