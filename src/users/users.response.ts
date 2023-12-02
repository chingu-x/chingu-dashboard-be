import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

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

    createdAt: Date;
    updatedAt: Date;
}

// Details for user only, may include sensitive detail
export class PrivateUserResponse extends OmitType(UserResponse, [
    "comment",
] as const) {}

// User details visible to public, all sensitive details are not included
export class PublicUserResponse extends OmitType(UserResponse, [
    "comment",
    "gender",
    "email",
] as const) {}
