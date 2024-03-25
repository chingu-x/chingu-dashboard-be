import { SignupDto } from "./signup.dto";
import { IsNotEmpty } from "class-validator";
import { ApiProperty, OmitType } from "@nestjs/swagger";

export class ResetPasswordDto extends OmitType(SignupDto, ["email"] as const) {
    @IsNotEmpty()
    @ApiProperty({
        example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwd2FkTHBKbE13UVdrbWQ0WEZnYVlYbnJkZUhPM0dUeVlGblNaYm0xRDNBSWd3RXZKQnBQdmpUX2p6Sklkc0dlVk1WYXFQQjN5SDJLYl84RDc2ekZWQSIsInVzZXJJZCI6ImU0MTE5ZTAyLWY3YjMtNGQyNS1iZDE2LTY5MjVjNWI0ZTg5MSIsImlhdCI6MTcwMjM4OTM4MiwiZXhwIjoxNzAyMzkyOTgyfQ.hXT0rG3tY9xI4MQdvx1kWCHzH4Mq8V7Dn57Vh51kWHQ",
    })
    token: string;
}
