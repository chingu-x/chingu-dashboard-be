import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteIdeationVoteDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;
}
