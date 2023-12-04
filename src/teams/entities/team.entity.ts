import { ApiProperty } from "@nestjs/swagger";
import { VoyageTeam } from "@prisma/client";

export class VoyageTeamEntity implements VoyageTeam {
    @ApiProperty()
    id: number;

    @ApiProperty()
    voyageId: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    statusId: number;

    @ApiProperty()
    repoUrl: string;

    @ApiProperty()
    repoUrlBE: string | null;

    @ApiProperty()
    deployedUrl: string | null;

    @ApiProperty()
    deployedUrlBE: string | null;

    @ApiProperty()
    tierId: number;

    @ApiProperty()
    endDate: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
