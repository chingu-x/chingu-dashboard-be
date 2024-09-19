import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateTechStackCategoryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "CDN" })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Host for static resources" })
    description: string;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    voyageTeamId: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 4 })
    voyageTeamMemberId: number;
}
