import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateFeatureOrderDto {
    @IsNotEmpty()
    @ApiProperty()
    order: number;
}
