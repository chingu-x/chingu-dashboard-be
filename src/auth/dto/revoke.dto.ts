import { ApiProperty } from "@nestjs/swagger";

export class RevokeRTDTo {
    @ApiProperty({
        example: "ebf84db9-3c8d-4900-a1eb-6a0050e983bb",
    })
    userId?: string;

    @ApiProperty({
        example: "elza59@ethereal.email",
    })
    email?: "elza59@ethereal.email";
}
