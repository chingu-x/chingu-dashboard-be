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

export class UpdateTechSelectionsDto {
    @ApiProperty({
        description: "Array of tech items to update 'isSelected'.",
        type: TechSelectionDto,
        isArray: true,
    })
    techs: TechSelectionDto[];
}
