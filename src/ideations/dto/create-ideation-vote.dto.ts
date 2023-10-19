import { ApiProperty } from "@nestjs/swagger";

export class CreateIdeationVoteDto {
    @ApiProperty()
    votedBy: string;
    userId: number;
    ProjectIdea: number;
    protectIdeaId: number;
}
