import { ApiProperty } from "@nestjs/swagger";

export class UpdateTeamMemberDto {
    @ApiProperty()
    hrPerSprint: number;
}
