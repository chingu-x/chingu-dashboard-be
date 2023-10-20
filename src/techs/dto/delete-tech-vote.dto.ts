import {IsNotEmpty, IsUUID} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class DeleteTeamTechVoteDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    removedBy: string;
}