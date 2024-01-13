import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";
import { CreateIdeationDto } from "./create-ideation.dto";

export class UpdateIdeationDto extends PartialType(CreateIdeationDto) {
    @IsString()
    @ApiProperty({ example: "Fitness Tracker App" })
    title: string;

    @IsString()
    @ApiProperty({ example: "Use React app, node.js backend, and SQL" })
    description: string;

    @IsString()
    @ApiProperty({
        example:
            "Lists workouts, video walkthroughs, calendar scheduling, and fitness diary.",
    })
    vision: string;
}
