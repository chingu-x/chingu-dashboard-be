import { Body } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { ProjectIdea } from "@prisma/client";

export class Ideation implements ProjectIdea {
    @ApiProperty()
    id: number;

    @ApiProperty()
    voyageTeamMemberId: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    vision: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({type: [Number], required: false, nullable: true})
    projectIdeaVotes: number[];
}
