import { ApiProperty } from "@nestjs/swagger";

export class TechSelectionDto {
    @ApiProperty({
        description: "tech id",
        example: 1,
    })
    techId: number;

    @ApiProperty({
        description: "Selected flag",
        example: true,
    })
    isSelected: boolean;
}

export class TechCategoryDto {
    @ApiProperty({
        description: "tech id",
        example: 1,
    })
    categoryId: number;

    @ApiProperty({
        description: "Array of tech items to update 'isSelected'.",
        type: TechSelectionDto,
        isArray: true,
    })
    techs: TechSelectionDto[];
}

export class UpdateTechSelectionsDto {
    @ApiProperty({
        description: "Array of categories with tech selection values",
        type: TechCategoryDto,
        isArray: true,
    })
    categories: TechCategoryDto[];
}
