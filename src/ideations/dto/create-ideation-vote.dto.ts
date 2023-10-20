import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString} from 'class-validator';

export class CreateIdeationVoteDto {
    //TODO update userID to uuid once authentication in place.
    @IsNotEmpty()
    @ApiProperty()
    userId: number;

    @IsNotEmpty()
    @ApiProperty()
    projectIdeaId: number;
}
