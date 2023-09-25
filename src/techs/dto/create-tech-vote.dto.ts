import {ApiProperty} from "@nestjs/swagger";

export class CreateTechVoteDto {
    @ApiProperty()
    votedBy: string
}