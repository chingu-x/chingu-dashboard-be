// shared response types here to prevent circular imports
import { ApiProperty } from "@nestjs/swagger";

export class VoyageStatus {
    id: number;

    @ApiProperty({ example: "Developer" })
    name: string;
}
