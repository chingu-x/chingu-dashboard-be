import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class DeleteTeamTechDto {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    voyageTeamMemberId: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        description: "tech stack item id",
        example: 1,
    })
    techId: number;
}
