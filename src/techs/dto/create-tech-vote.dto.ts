import { IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTeamTechVoteDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    votedBy: string;
}
