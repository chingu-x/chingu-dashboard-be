import { ApiProperty } from "@nestjs/swagger";

export class CreateResourceDto {
    @ApiProperty()
    url: string;

    @ApiProperty()
    title: string;
}
