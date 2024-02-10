import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateFeatureOrderAndCategoryDto {
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    @IsNumber()
    order: number;

    @IsOptional()
    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    featureCategoryId: number;
}
