import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAgendaDto {
    @IsString()
    @ApiProperty({
        description: "Agenda Title - Topic to discuss at the meeting",
        example: "Contribute to the agenda!",
    })
    title: string;

    @IsString()
    @ApiProperty({
        description: "Description of the meeting agenda item",
        example: "To get started, click the Add Topic button...",
    })
    description: string;

    @IsBoolean()
    @IsOptional()
    status: boolean = false;
}
