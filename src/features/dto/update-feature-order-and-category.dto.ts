import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateFeatureOrderAndCategoryDto {
    @IsNotEmpty()
    @ApiProperty()
    order: number;

    @IsOptional()
    @ApiPropertyOptional()
    featureCategoryId: number;
}
