import { ApiProperty } from "@nestjs/swagger";

export class ReSeedSuccessResponse {
    @ApiProperty({
        example:
            "Database reseed successful. You are logged out. Please log in again.",
    })
    message: string;
}
