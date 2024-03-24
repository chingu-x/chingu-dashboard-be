import { FormResponseDto } from "../../global/dtos/FormResponse.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCheckinFormResponseDto {
    @ApiProperty({
        description: "voyage team member id, not userId",
        example: 1,
    })
    @IsNotEmpty()
    voyageTeamMemberId: number;

    @ApiProperty({
        description: "sprint id, not sprint number",
        example: 1,
    })
    @IsNotEmpty()
    sprintId: number;

    @ApiProperty({
        description: "An array of form responses",
        example: [
            { questionId: 1, text: "All" },
            { questionId: 2, text: "Deploy app" },
        ],
    })
    @IsNotEmpty()
    responses: FormResponseDto[];
}
