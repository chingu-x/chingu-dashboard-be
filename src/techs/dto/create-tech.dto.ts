import { ApiProperty } from "@nestjs/swagger";
import {IsInt, IsNotEmpty, IsString, IsUUID} from "class-validator";


export class CreateTeamTechDto {

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    votedBy: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    techName: string;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    techCategoryId: number;
}
