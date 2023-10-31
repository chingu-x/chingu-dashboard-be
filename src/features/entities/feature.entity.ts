import { ApiProperty } from "@nestjs/swagger";
import { ProjectFeature } from "@prisma/client";

export class Feature implements ProjectFeature{
    @ApiProperty()
    id: number;

    @ApiProperty()
    teamMemberId: number;

    @ApiProperty()
    featureCategoryId: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
