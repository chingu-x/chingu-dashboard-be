import { SignupDto } from "./signup.dto";
import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto extends SignupDto {
    @IsNotEmpty()
    @ApiProperty({
        example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IlRXWGloZUpJdG1EUkF1NHBVekN4THdZR1JIcktBbVJsUWxKb0loaGhwV3NmLVlCRU8xRzVlaHgwcm9oMlFfSWlJSS00cHJ3SlhpaC1nWjhwRVlQazJ3IiwiZW1haWwiOiJiNzBiYjVlYS00NzQzLTQxY2QtOGJmNC1iYzllYzcxZTc1MDciLCJzaWduT3B0aW9ucyI6eyJleHBpcmVzSW4iOiIxIGRheSJ9LCJpYXQiOjE3MDIwNDUxNzIsImV4cCI6MTcwMjY0OTk3Mn0.JcVSSnYb80JGjF2I4OyjhAQj5qG7cLqZPbjGjRXGVf8",
    })
    token: string;
}
