import { ApiProperty } from "@nestjs/swagger";

export class SelectTechDto {
    @ApiProperty({
        description: "tech id",
    })
    techId: number;

    @ApiProperty({
        description: "category id of tech",
    })
    categoryId: number;
}

export class UpdateTechSelectionsDto {
    @ApiProperty({
        description: "Array of tech items to set as 'isSelected'.",
        type: SelectTechDto,
        isArray: true,
    })
    techs: SelectTechDto[];
}
