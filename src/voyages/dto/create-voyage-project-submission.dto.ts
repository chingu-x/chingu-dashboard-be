import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { FormResponseDto } from "../../global/dtos/FormResponse.dto";
import { Type } from "class-transformer";

export class CreateVoyageProjectSubmissionDto {
    @ApiProperty({
        description: "Voyage team Id",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    voyageTeamId: number;

    @ApiProperty({
        description: "An array of form responses",
        example: [
            { questionId: 26, text: "All" },
            { questionId: 27, text: "Deploy app" },
        ],
    })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FormResponseDto)
    responses: FormResponseDto[];
}
