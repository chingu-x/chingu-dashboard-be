import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateTeamTechDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Typescript" })
    techName: string;
}
