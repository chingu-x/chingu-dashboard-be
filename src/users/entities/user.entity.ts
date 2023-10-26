import { User } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class UserEntity implements User {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName;

    @ApiProperty()
    lastName;

    @ApiProperty()
    avatar;

    @ApiProperty()
    githubId;

    @ApiProperty()
    discordId;

    @ApiProperty()
    twitterId;

    @ApiProperty()
    linkedinId;

    @ApiProperty()
    email: string;

    @ApiProperty()
    @Exclude()
    password;

    @ApiProperty()
    genderId;

    @ApiProperty()
    countryCode;

    @ApiProperty()
    timezone;

    @ApiProperty()
    comment;

    @ApiProperty()
    createdAt;

    @ApiProperty()
    updatedAt;
}
