import { VoyageRole } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class VoyageRoleEntity implements VoyageRole {
    id: number;

    @ApiProperty({ example: "Developer" })
    name: string;

    description: string;

    createdAt: Date;
    updatedAt: Date;
}
