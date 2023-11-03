import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        example: "jessica.williamson@gmail.com",
    })
    email: string;

    @ApiProperty({
        example: "password",
    })
    password: string;
}
