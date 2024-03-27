import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserLookupByEmailDto {
    @ApiProperty({ example: "dan@random.com" })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}
