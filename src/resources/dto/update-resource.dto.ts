import { PartialType } from "@nestjs/mapped-types";
import { CreateResourceDto } from "./create-resource.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
    @IsNotEmpty()
    @IsString()
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

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: "Github",
    })
    title: string;
}
