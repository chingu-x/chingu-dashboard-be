import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class FormResponseDto {
    @ApiProperty({
        description: "question id",
    })
    questionId: number;

    @ApiProperty({
        description: "choiceId, if it's a multiple choice questions",
    })
    @IsOptional()
    optionChoiceId?: number;

    @ApiProperty({
        description: "for questions with a text response",
        example: "Team member x landed a job this week.",
    })
    @IsOptional()
    text?: string;

    @ApiProperty({
        description: "for question with yes/no answer",
        example: true,
    })
    @IsOptional()
    boolean?: boolean;

    @ApiProperty({
        description: "for numerical responses",
    })
    @IsOptional()
    numeric?: number;
}
