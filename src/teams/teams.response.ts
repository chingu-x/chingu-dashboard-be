import { ApiProperty } from "@nestjs/swagger";
import { Optional } from "@nestjs/common";
import { PublicUserResponse } from "../users/users.response";

export class VoyageTeamResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    voyageId: number;

    @ApiProperty({ example: "v47-tier2-team-4" })
    name: string;

    @ApiProperty({ example: 1 })
    statusId: number;

    @ApiProperty({
        example:
            "https://github.com/chingu-voyages/soloproject-tier3-chinguweather",
    })
    repoUrl: string;

    @Optional()
    @ApiProperty({ example: "https://github.com/chingu-voyages/Handbook" })
    repoUrlBE: string | null;

    @Optional()
    @ApiProperty({ example: "https://www.chingu.io/" })
    deployedUrl: string | null;

    @Optional()
    @ApiProperty({
        example:
            "https://stackoverflow.com/questions/4848964/difference-between-text-and-varchar-character-varying",
    })
    deployedUrlBE: string | null;

    @ApiProperty({ example: 1 })
    tierId: number;

    @ApiProperty({ example: "2024-11-09T00:00:00.000Z" })
    endDate: Date;

    @ApiProperty({ example: "2023-11-30T06:47:10.943Z" })
    createdAt: Date;

    @ApiProperty({ example: "2023-11-30T06:47:10.943Z" })
    updatedAt: Date;
}

class VoyageRole {
    @ApiProperty({ example: "Developer" })
    name: string;
}

class VoyageTeamMember {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty()
    member: PublicUserResponse;

    @ApiProperty({ example: 20 })
    hrPerSprint: number;

    @ApiProperty()
    voyageRole: VoyageRole;
}

export class PublicVoyageTeamWithUserResponse extends VoyageTeamResponse {
    @ApiProperty({ isArray: true })
    voyageTeamMembers: VoyageTeamMember;
}

export class VoyageTeamMemberUpdateResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "6bd33861-04c0-4270-8e96-62d4fb587527" })
    userId: string;

    @ApiProperty({ example: 1 })
    voyageTeamId: number;

    @ApiProperty({ example: 1 })
    voyageRoleId: number;

    @ApiProperty({ example: 1 })
    statusId: number;

    @ApiProperty({ example: 20 })
    hrPerSprint: number;

    @ApiProperty({ example: "2023-11-30T06:47:10.943Z" })
    createdAt: Date;

    @ApiProperty({ example: "2023-11-30T06:47:10.943Z" })
    updatedAt: Date;
}
