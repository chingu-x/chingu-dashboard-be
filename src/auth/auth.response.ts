import { ApiProperty } from "@nestjs/swagger";

export class LoginResponse {
    @ApiProperty({ example: "Login Success" })
    message: string;
}

export class LogoutResponse {
    @ApiProperty({ example: "Logout Success" })
    message: string;
}
