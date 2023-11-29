import { ApiProperty } from "@nestjs/swagger";

export class Team {
    @ApiProperty()
    id: number;

    @ApiProperty()
    voyageId: number;

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
}
