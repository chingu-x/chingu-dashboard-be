import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RevokeRTDTo {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "ebf84db9-3c8d-4900-a1eb-6a0050e983bb",
    })
    userId?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "elza59@ethereal.email",
    })
    email?: "elza59@ethereal.email";
}
