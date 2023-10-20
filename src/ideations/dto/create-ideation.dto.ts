import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString} from 'class-validator';


export class CreateIdeationDto {
    //TODO update userID to uuid once authentication in place.
    @IsNotEmpty()
    @ApiProperty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsString()
    @ApiProperty()
    description: string;

    @IsString()
    @ApiProperty()
    vision: string;
}
