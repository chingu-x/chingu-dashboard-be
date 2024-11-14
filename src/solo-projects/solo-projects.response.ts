import { ApiProperty } from "@nestjs/swagger";

class UserWithSocials {
    @ApiProperty({
        example: "Jessica",
    })
    firstname: string;

    @ApiProperty({ example: "Williamson" })
    lastname: string;

    @ApiProperty({
        example: "12345436342323",
        description: "Discord ID",
    })
    discordId: string;

    @ApiProperty({
        example: "jessica-discord",
        description: "Discord ID",
    })
    discordUsername: string;

    @ApiProperty({
        example: "jessica-github",
        description: "github ID / username",
    })
    github: string;
}

class Comment {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "This is a tier 2 project, not tier 3" })
    content: number;

    @ApiProperty({ example: UserWithSocials })
    author: UserWithSocials;
}

class Response {
    @ApiProperty({ example: "Repo Url" })
    question: string;

    @ApiProperty({ example: "text" })
    inputType: string;

    @ApiProperty({ example: "www.github.com/repo" })
    text: string | null;

    @ApiProperty({ example: "12" })
    number: number | null;

    @ApiProperty({ example: true })
    boolean: boolean | null;

    @ApiProperty({ example: true })
    choice: string | null;
}

export class SoloProjectsResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: UserWithSocials })
    user: UserWithSocials;

    @ApiProperty({ example: UserWithSocials })
    evaluator: UserWithSocials;

    @ApiProperty({ example: "Waiting Evaluation" })
    status: string;

    @ApiProperty({ example: Comment, isArray: true })
    comments: Comment;

    @ApiProperty({ example: Response, isArray: true })
    responses: Response;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    createdAt: Date;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    updatedAt: Date;
}
