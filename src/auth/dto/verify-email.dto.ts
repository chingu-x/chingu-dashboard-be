import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class VerifyEmailDto {
    @IsNotEmpty()
    @ApiProperty({
        example: "kade.upton15@ethereal.email",
    })
    email: string;

    @IsNotEmpty()
    @ApiProperty({
        example:
            "3CoEmWZxiVkvfFKhtEQapMv03CQAuwaIjVblFbDQQE6ZsamoobDid5yV4bUQfYOMBD1Zk98iNB8EqO1u5OVvWw",
    })
    token: string;
}
