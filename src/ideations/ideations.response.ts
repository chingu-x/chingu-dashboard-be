import { ApiProperty } from "@nestjs/swagger";

class Member {
    @ApiProperty({ example: "3d41c6be-bcd5-41b2-960c-0e33abb250c2" })
    id: string;

    @ApiProperty({
        example:
            "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=wavatar&r=x",
    })
    avatar: string;

    @ApiProperty({ example: "Joso" })
    firstName: string;

    @ApiProperty({ example: "Madar" })
    lastName: string;
}

class VotedBy {
    @ApiProperty()
    member: Member;
}

class ContributedBy {
    @ApiProperty()
    member: Member;
}

class IdeationVote {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    voyageTeamMemberId: number;

    @ApiProperty({ example: 1 })
    projectIdeaId: number;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    createdAt: Date;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    updatedAt: Date;

    @ApiProperty()
    votedBy: VotedBy;
}

export class IdeationResponse {
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
}

export class IdeationVoteResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    voyageTeamMemberId: number;

    @ApiProperty({ example: 1 })
    projectIdeaId: number;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    createdAt: Date;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    updatedAt: Date;
}

export class TeamIdeationsResponse {
    @ApiProperty({ example: 1 })
    id: number;

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

    @ApiProperty()
    contributedBy: ContributedBy;

    @ApiProperty({ isArray: true })
    projectIdeaVotes: IdeationVote;
}
