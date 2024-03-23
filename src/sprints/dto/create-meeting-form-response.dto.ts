import { ApiProperty } from "@nestjs/swagger";
import { FormResponseDto } from "../../global/dtos/FormResponse.dto";
import { IsArray } from "class-validator";

export class CreateMeetingFormResponseDto {
    @ApiProperty({
        description:
            "Meeting form responses e.g. Sprint review, sprint planning",
        type: FormResponseDto,
        isArray: true,
    })
    @IsArray()
    responses: FormResponseDto[];
}
