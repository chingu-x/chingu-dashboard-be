import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateFeatureOrderAndCategoryDto {
    @IsNotEmpty()
    @ApiProperty()
    order: number;

    @ApiProperty()
    featureCategoryId: number;
}
