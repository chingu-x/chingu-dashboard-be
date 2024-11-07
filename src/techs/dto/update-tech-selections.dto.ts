import { ApiProperty } from "@nestjs/swagger";

export class UpdateTechSelectionDto {
    // @ApiProperty({
    //     description: "tech id",
    //     example: 1,
    // })
    // techId: number;

    @ApiProperty({
        description: "Selected flag",
        example: true,
    })
    isSelected: boolean;
}
