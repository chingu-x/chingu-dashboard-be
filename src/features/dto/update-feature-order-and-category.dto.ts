import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateFeatureOrderAndCategoryDto {
    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    order: number;

    @IsOptional()
    @ApiPropertyOptional()
    @IsNumber()
    featureCategoryId: number;
}
