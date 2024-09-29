import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateTechStackCategoryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "ORM" })
    newName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "DB interface" })
    description: string;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    voyageTeamId: number;
}
