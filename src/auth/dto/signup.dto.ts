import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: "kade.upton15@ethereal.email",
    })
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty({
        example: "pxpCJMSVK7Wy9rzhat",
    })
    password: string;
}
