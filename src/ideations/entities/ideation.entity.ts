import { ApiProperty } from "@nestjs/swagger";
import { ProjectIdea } from "@prisma/client";

export class Ideation implements ProjectIdea {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    voyageTeamMemberId: number;

    @ApiProperty({ example: "Fitness Tracker App" })
    title: string;

    @ApiProperty({ example: "Use React app, node.js backend, and SQL" })
    description: string;

    @ApiProperty({
        example:
            "Lists workouts, video walkthroughs, calendar scheduling, and fitness diary.",
    })
    vision: string;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    createdAt: Date;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    updatedAt: Date;

    @ApiProperty({ type: [Number], required: false, nullable: true })
    projectIdeaVotes: number[];
}
