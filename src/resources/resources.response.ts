import { ApiProperty } from "@nestjs/swagger";

export class TeamResourceResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    teamMemberId: number;

    @ApiProperty({ example: "https://www.github.com/" })
    url: string;

    @ApiProperty({ example: "Github" })
    title: string;

    @ApiProperty({ example: "2023-11-30T06:47:11.694Z" })
    createdAt: Date;

    @ApiProperty({ example: "2023-11-30T06:47:11.694Z" })
    updatedAt: Date;
}

class AddedBy {
    @ApiProperty()
    member: MemberNameAndAvatar;
}

class MemberNameAndAvatar {
    @ApiProperty({ example: "Jessica" })
    firstName: string;

    @ApiProperty({ example: "Williamson" })
    lastName: string;

    @ApiProperty({
        example:
            "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=robohash&r=x",
    })
    avatar: string;
}

export class TeamResourceAddedByResponse extends TeamResourceResponse {
    @ApiProperty({ isArray: true })
    addedBy: AddedBy;
}
