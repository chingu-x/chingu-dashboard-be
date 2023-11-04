import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: "jessica.williamson@gmail.com",
    })
    email: string;

    @IsNotEmpty()
    @ApiProperty({
        example: "password",
    })
    password: string;
}
