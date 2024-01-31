import { PartialType } from "@nestjs/mapped-types";
import { CreateFeatureDto } from "./create-feature.dto";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {
    @ApiProperty({ example: 1 })
    teamMemberId: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Message Board" })
    description: string;
}
