import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { VoyageRoleEntity } from "../global/entities/voyage-role.entity";
import { VoyageStatus } from "../global/responses/shared";
import { IsIn } from "class-validator";

class Gender {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "F" })
    abbreviation: string;

    @ApiProperty({ example: "female" })
    description: string;

    createdAt: Date;
    updatedAt: Date;
}

class VoyageTeamWithoutMember {
    @ApiProperty({ example: 1 })
    id: number;

    userId: string;

    @ApiProperty()
    voyageRole: VoyageRoleEntity;

    statusId: number;

    @ApiProperty()
    status: VoyageStatus;

    @ApiProperty({ example: 10 })
    hrPerSprint: number;

    @ApiProperty({ example: "2023-12-01T13:55:00.611Z" })
    createdAt: Date;

    @ApiProperty({ example: "2023-12-01T13:55:00.611Z" })
    updatedAt: Date;
}

class Voyage {
    @ApiProperty()
    status: VoyageStatus;
}

class VoyageTeam {
    @ApiProperty({ example: "v47-tier2-team-4" })
    name: string;

    @ApiProperty()
    voyage: Voyage;
}

class UserVoyageTeam {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    voyageTeamId: number;

    @ApiProperty()
    voyageTeam: VoyageTeam;

    @ApiProperty()
    voyageRole: VoyageRoleEntity;
}

// Full User detail - admin purpose, password excluded
export class UserResponse {
    @ApiProperty({ example: "6bd33861-04c0-4270-8e96-62d4fb587527" })
    id: string;

    @ApiProperty({ example: "Jessica" })
    firstName: string;

    @ApiProperty({ example: "Williamson" })
    lastName: string;

    @ApiProperty({
        example:
            "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=robohash&r=x",
    })
    avatar: string;

    @ApiProperty({ example: "jess-github" })
    githubId: string;

    @ApiProperty({ example: "jess-discord" })
    discordId: string;

    @ApiProperty({ example: "jess-twitter" })
    twitterId: string;

    @ApiProperty({ example: "jess-linkedin" })
    linkedinId: string;

    @ApiProperty({ example: "jessica.williamson@gmail.com" })
    email: string;

    @Exclude()
    password: string;

    gender: Gender;

    @ApiProperty({ example: "AU" })
    countryCode: string;

    @ApiProperty({ example: "Australia/Melbourne" })
    timezone: string;

    @ApiProperty({
        example:
            "This is an admin comment. And should not be returned except for admin endpoints.",
    })
    comment: string;

    @IsIn(["admin", "voyager", "user"])
    @ApiProperty({ isArray: true, example: ["admin", "voyager"] })
    roles: string;

    createdAt: Date;
    updatedAt: Date;
}

// Details for user only, may include sensitive detail
export class PrivateUserResponse extends OmitType(UserResponse, [
    "comment",
] as const) {
    @ApiProperty({ isArray: true })
    voyageTeamMembers: UserVoyageTeam;
}

// User details visible to public, all sensitive details are not included
export class PublicUserResponse extends OmitType(UserResponse, [
    "id",
    "comment",
    "gender",
    "email",
] as const) {}

export class FullUserResponse extends UserResponse {
    @ApiProperty({ isArray: true })
    voyageTeamMembers: VoyageTeamWithoutMember;
}
