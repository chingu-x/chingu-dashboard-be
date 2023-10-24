import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty} from 'class-validator';

export class CreateIdeationVoteDto {
    @IsNotEmpty()
    @ApiProperty()
    projectIdeaId: number;
}
