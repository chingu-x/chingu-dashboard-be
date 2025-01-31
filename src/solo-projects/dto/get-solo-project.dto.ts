import { IsIn, IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { Type } from "class-transformer";
import { soloProjectStatuses } from "@/global/constants/statuses";
import { ApiProperty } from "@nestjs/swagger";

export class GetSoloProjectDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    offset: number = 0;

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    pageSize: number = 30;

    @IsOptional()
    sort?: string;

    @ApiProperty({
        required: false,
        enum: soloProjectStatuses,
    })
    @IsOptional()
    @IsIn(soloProjectStatuses)
    status?: string;
}
