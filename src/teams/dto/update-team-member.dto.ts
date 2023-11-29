import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class UpdateTeamMemberDto {
    @IsInt()
    @ApiProperty()
    hrPerSprint: number;
}
