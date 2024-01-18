import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateFeatureDto {
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    featureCategoryId: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Message Board" })
    description: string;
}
