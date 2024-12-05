import { ApiProperty } from "@nestjs/swagger";

export class UpdateTechSelectionDto {
    @ApiProperty({
        description: "Selected flag",
        example: true,
    })
    isSelected: boolean;
}
