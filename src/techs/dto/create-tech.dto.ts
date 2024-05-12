import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateTeamTechDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Nextjs" })
    techName: string;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    techCategoryId: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 4 })
    voyageTeamMemberId: number;
}
