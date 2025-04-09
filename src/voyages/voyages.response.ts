import { ApiProperty } from "@nestjs/swagger";

class User {
    @ApiProperty({
        example: "Jessica",
    })
    firstName: string;

    @ApiProperty({
        example: "Williamson",
    })
    lastName: string;

    @ApiProperty({
        example: "F",
    })
    gender?: string;

    @ApiProperty({
        example: "AU",
    })
    countryCode: string;
}

export class UserAppResponse {
    // voyage app table id, not userId
    @ApiProperty({
        example: "1",
    })
    id: number;

    @ApiProperty()
    user: User;
}
