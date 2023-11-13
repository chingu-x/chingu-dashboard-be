import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateFeatureDto {
    @IsNotEmpty()
    @ApiProperty()
    featureCategoryId: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
}
