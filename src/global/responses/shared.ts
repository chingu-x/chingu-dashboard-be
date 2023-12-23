// shared response types here to prevent circular imports
import { ApiProperty } from "@nestjs/swagger";

export class VoyageStatus {
    id: number;

    @ApiProperty({ example: "Active" })
    name: string;
}

export class GenericSuccessResponse {
    @ApiProperty({ example: "Email verified" })
    message: string;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
