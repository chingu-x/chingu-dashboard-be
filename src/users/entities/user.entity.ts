import { User } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class UserEntity implements User {
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    emailVerified: boolean;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    avatar: string;

    @ApiProperty()
    githubId: string;

    @ApiProperty()
    discordId: string;

    @ApiProperty()
    twitterId: string;

    @ApiProperty()
    linkedinId: string;

    @Exclude()
    password: string;

    @ApiProperty()
    genderId: number;

    @ApiProperty()
    countryCode: string;

    @ApiProperty()
    timezone: string;

    @ApiProperty()
    comment: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class VoyageUserEntity implements User {
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    avatar: string;

    @ApiProperty()
    githubId: string;

    @ApiProperty()
    discordId: string;

    @ApiProperty()
    twitterId: string;

    @ApiProperty()
    linkedinId: string;

    @ApiProperty()
    email: string;

    @Exclude()
    password: string;

    genderId: number;

    @ApiProperty()
    countryCode: string;

    @ApiProperty()
    timezone: string;

    @ApiProperty()
    comment: string;

    createdAt: Date;

    updatedAt: Date;
}
