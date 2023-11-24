import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: "kade.upton15@ethereal.email",
    })
    email: string;

    @IsNotEmpty()
    @ApiProperty({
        example: "pxpCJMSVK7Wy9rzhat",
    })
    password: string;
}
