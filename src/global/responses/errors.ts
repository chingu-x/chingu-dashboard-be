import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ConflictErrorResponse {
    @ApiPropertyOptional({
        example: "Nextjs already exists in the available team tech stack.",
    })
    message: string;

    @ApiProperty({ example: "Conflict" })
    error: string;

    @ApiProperty({ example: 409 })
    statusCode: number;
}

export class BadRequestErrorResponse {
    @ApiPropertyOptional({
        example: "Invalid input",
    })
    message: string;

    @ApiProperty({ example: "Bad Request" })
    error: string;

    @ApiProperty({ example: 400 })
    statusCode: number;
}

export class UnauthorizedErrorResponse {
    @ApiPropertyOptional({
        example: "Malformed refresh token",
    })
    message: string;

    @ApiProperty({ example: "Unauthorized" })
    error: string;

    @ApiProperty({ example: 401 })
    statusCode: number;
}

export class LoginUnauthorizedErrorResponse extends UnauthorizedErrorResponse {
    @ApiPropertyOptional({
        example:
            "Signup failed. Invalid email and/or password. Please try again.",
    })
    message: string;
}

export class NotFoundErrorResponse {
    @ApiPropertyOptional({
        example: "Record to delete does not exist.",
    })
    message: string;

    @ApiProperty({ example: "Not Found" })
    error: string;

    @ApiProperty({ example: 404 })
    statusCode: number;
}
