import { ApiProperty } from "@nestjs/swagger";

export class CreateIdeationVoteDto {
    @ApiProperty()
    userId: number;
    ProjectIdea: number;
    protectIdeaId: number;
}
