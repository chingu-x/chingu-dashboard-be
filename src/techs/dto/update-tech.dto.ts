import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateTeamTechDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Typescipt" })
    techName: string;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 8 })
    voyageTeamMemberId: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        description: "tech stack item id",
        example: 1,
    })
    techId: number;
}
