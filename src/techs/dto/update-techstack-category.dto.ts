import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateTechStackCategoryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "ORM" })
    newName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "DB interface" })
    description: string;
}
