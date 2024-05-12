import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateTeamTechDto } from "./create-tech.dto";

export class DeleteTeamTechDto extends PartialType(CreateTeamTechDto) {
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
