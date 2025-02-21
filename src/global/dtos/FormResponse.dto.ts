import { ApiProperty } from "@nestjs/swagger";
import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    IsObject,
} from "class-validator";

export class FormResponseDto {
    @ApiProperty({
        description: "question id",
    })
    @IsNumber()
    questionId: number;

    @ApiProperty({
        description: "choiceId, if it's a multiple choice questions",
    })
    @IsOptional()
    @IsNumber()
    optionChoiceId?: number;

    @ApiProperty({
        description: "for questions with a text response",
        example: "Team member x landed a job this week.",
    })
    @IsOptional()
    @IsString()
    text?: string;

    @ApiProperty({
        description: "for question with yes/no answer",
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    boolean?: boolean;

    @ApiProperty({
        description: "for numerical responses",
    })
    @IsNumber()
    @IsOptional()
    numeric?: number;

    @ApiProperty({
        description: "configuration for parsing the response",
        required: false,
        example: {
            example1: {
                parseConfig: {
                    icon: "greenRocket",
                    iconUrl: ".../greenRocket.png",
                },
            },
            example2: {
                parseConfig: {
                    yes: "Yes",
                    no: "No",
                },
            },
        },
    })
    @IsOptional()
    @IsObject()
    parseConfig?: Record<string, any>;
}
