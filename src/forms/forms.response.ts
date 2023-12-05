import { ApiProperty } from "@nestjs/swagger";
import { Optional } from "@nestjs/common";

class FormType {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "meeting" })
    name: string;
}

class InputType {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "text" })
    name: string;
}

class OptionChoice {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    optionGroupId: number;

    @ApiProperty({ example: "Tier 1" })
    text: string;
}

class OptionGroup {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Tier" })
    name: string;

    @ApiProperty({ isArray: true })
    optionChoices: OptionChoice;
}

class Response {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    questionId: number;

    @Optional()
    @ApiProperty({ example: 1 })
    optionChoiceId: number;

    @Optional()
    @ApiProperty({ example: null })
    numeric: number;

    @Optional()
    @ApiProperty({ example: null })
    boolean: boolean;

    @Optional()
    @ApiProperty({ example: "Everything went well." })
    text: string;

    @ApiProperty({ example: 1 })
    responseGroupId: number;
}

class Question {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    order: number;

    @ApiProperty()
    inputType: InputType;

    @ApiProperty({ example: "Changes to be made for the next sprint?" })
    text: string;

    @Optional()
    @ApiProperty({
        example:
            "Share your thoughts on what could be changed for the next sprint",
    })
    description: string;

    @ApiProperty({ example: false })
    answerRequired: boolean;

    @Optional()
    @ApiProperty({ example: null })
    multipleAllowed: boolean;

    @Optional()
    @ApiProperty({ example: null })
    optionGroup: OptionGroup;

    @ApiProperty({ isArray: true })
    responses: Response;
}

export class FormResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty()
    formType: FormType;

    @ApiProperty({ example: "Retrospective & Review" })
    title: string;

    @Optional()
    @ApiProperty({ example: "Sprint Review Form" })
    description: string;

    @ApiProperty({ isArray: true })
    questions: Question;
}

export class ResponseResponse extends Response {
    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    startDate: Date;

    @ApiProperty({ example: "2024-01-14T00:00:00.000Z" })
    endDate: Date;
}
