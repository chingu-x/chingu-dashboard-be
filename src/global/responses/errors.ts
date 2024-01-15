import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ConflictErrorResponse {
    @ApiProperty({
        example: "Nextjs already exists in the available team tech stack.",
    })
    message: string;

    @ApiPropertyOptional({ example: "Conflict" })
    error: string;

    @ApiProperty({ example: 409 })
    statusCode: number;
}

export class BadRequestErrorResponse {
    @ApiProperty({
        example: "Invalid input",
    })
    message: string;

    @ApiPropertyOptional({ example: "Bad Request" })
    error: string;

    @ApiProperty({ example: 400 })
    statusCode: number;
}

export class UnauthorizedErrorResponse {
    @ApiProperty({
        example: "Malformed refresh token",
    })
    message: string;

    @ApiPropertyOptional({ example: "Unauthorized" })
    error: string;

    @ApiProperty({ example: 401 })
    statusCode: number;
}

export class LoginUnauthorizedErrorResponse extends UnauthorizedErrorResponse {
    @ApiProperty({
        example:
            "Signup failed. Invalid email and/or password. Please try again.",
    })
    message: string;
}

export class NotFoundErrorResponse {
    @ApiProperty({
        example: "Record to delete does not exist.",
    })
    message: string;

    @ApiPropertyOptional({ example: "Not Found" })
    error: string;

    @ApiProperty({ example: 404 })
    statusCode: number;
}

export class ForbiddenErrorResponse {
    @ApiProperty({
        example: "Access Denied",
    })
    message: string;

    @ApiPropertyOptional({ example: "Forbidden" })
    error: string;

    @ApiProperty({ example: 403 })
    statusCode: number;
}
