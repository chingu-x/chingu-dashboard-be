import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { FormResponseDto } from "../../global/dtos/FormResponse.dto";

export class CreateVoyageProjectSubmissionDto {
    @ApiProperty({
        description: "Voyage team Id",
        example: 1,
    })
    @IsNotEmpty()
    voyageTeamId: number;

    @ApiProperty({
        description: "An array of form responses",
        example: [
            { questionId: 11, text: "All" },
            { questionId: 12, text: "Deploy app" },
        ],
    })
    @IsNotEmpty()
    responses: FormResponseDto[];
}
