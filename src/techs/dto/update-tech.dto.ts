import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateTeamTechDto } from "./create-tech.dto";

export class UpdateTeamTechDto extends PartialType(CreateTeamTechDto) {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Typescipt" })
    techName: string;

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
