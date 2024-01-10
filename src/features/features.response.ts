import { ApiProperty } from "@nestjs/swagger";

class Category {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "must have" })
    name: string;
}

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

class AddedBY {
    @ApiProperty()
    member: Member;
}

export class FeatureResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    teamMemberId: number;

    @ApiProperty({ example: 1 })
    featureCategoryId: number;

    @ApiProperty({ example: "Message Board" })
    description: string;

    @ApiProperty({ example: 5 })
    order: number;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    createdAt: Date;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    updatedAt: Date;
}

export class FeatureCategoriesResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "must have" })
    name: string;

    @ApiProperty({ example: "features that define your MVP" })
    description: string;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    createdAt: Date;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    updatedAt: Date;
}

export class ExentedFeaturesResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Message Board" })
    description: string;

    @ApiProperty({ example: 5 })
    order: number;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    createdAt: Date;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    updatedAt: Date;

    @ApiProperty({ example: 1 })
    teamMemberId: number;

    @ApiProperty()
    category: Category;

    @ApiProperty()
    addedBy: AddedBY;
}
