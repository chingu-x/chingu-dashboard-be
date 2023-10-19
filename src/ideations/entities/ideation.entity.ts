import { ApiProperty } from "@nestjs/swagger";

export class Ideation {
    @ApiProperty()
    id: number;

    @ApiProperty()
    userId: number;

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

    @ApiProperty({required: false, nullable: true})
    projectIdeaVotes: [number] | null;
}
