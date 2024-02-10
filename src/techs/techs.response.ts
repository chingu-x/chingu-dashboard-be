import { ApiProperty } from "@nestjs/swagger";

class TeamMember {
    @ApiProperty({ example: "0c106af5-6b5a-4103-b206-1e10f0903bee" })
    id: string;

    @ApiProperty({ example: "Joso" })
    firstName: string;

    @ApiProperty({ example: "Madar" })
    lastName: string;

    @ApiProperty({
        example:
            "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=wavatar&r=x",
    })
    avatar: string;
}

class VotedBy {
    @ApiProperty()
    member: TeamMember;
}

class TeamTechStackItemVote {
    @ApiProperty()
    votedBy: VotedBy;
}

class TeamTechStackItem {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Javascript" })
    name: string;

    @ApiProperty({ isArray: true })
    teamTechStackItemVotes: TeamTechStackItemVote;
}

export class TeamTechResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Frontend" })
    name: string;

    @ApiProperty({ example: "Frontend Stuff" })
    description: string;

    @ApiProperty({ isArray: true })
    teamTechStackItems: TeamTechStackItem;
}

export class TechItemResponse {
    @ApiProperty({ example: 10 })
    id: number;

    @ApiProperty({ example: 11 })
    teamTechId: number;

    @ApiProperty({ example: "Frontend" })
    teamMemberId: number;

    @ApiProperty({ example: "2023-12-01T13:55:00.611Z" })
    createdAt: Date;

    @ApiProperty({ example: "2023-12-01T13:55:00.611Z" })
    updatedAt: Date;
}
