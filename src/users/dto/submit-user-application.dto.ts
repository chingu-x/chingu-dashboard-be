import { FormResponseDto } from "@/global/dtos/FormResponse.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class SubmitUserApplicationDto {
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
