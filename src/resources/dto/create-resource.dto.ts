import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateResourceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @IsUrl(
        {
            require_protocol: false,
            require_port: false,
            allow_underscores: true,
        },
        { message: "URL is not valid." },
    )
    @ApiProperty({
        example: "https://www.github.com/",
    })
    url: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "Github",
    })
    title: string;
}
