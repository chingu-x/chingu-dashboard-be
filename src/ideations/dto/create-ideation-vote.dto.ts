import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateIdeationVoteDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;
}
