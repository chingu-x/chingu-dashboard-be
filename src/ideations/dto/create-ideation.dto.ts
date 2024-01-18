import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateIdeationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Fitness Tracker App" })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Use React app, node.js backend, and SQL" })
    description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example:
            "Lists workouts, video walkthroughs, calendar scheduling, and fitness diary.",
    })
    vision: string;
}
