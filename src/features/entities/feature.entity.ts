import { ApiProperty } from "@nestjs/swagger";
import { ProjectFeature } from "@prisma/client";

export class Feature implements ProjectFeature {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    teamMemberId: number;

    @ApiProperty({ example: 1 })
    featureCategoryId: number;

    @ApiProperty({ example: "Message Board" })
    description: string;

    @ApiProperty({ example: 5 })
    order: number;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    createdAt: Date;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    updatedAt: Date;
}
