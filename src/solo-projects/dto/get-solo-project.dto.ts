import { IsIn, IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { Type } from "class-transformer";
import { soloProjectStatuses } from "@/global/constants/statuses";
import { ApiProperty } from "@nestjs/swagger";

export class GetSoloProjectDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({
        name: "offset",
        type: Number,
        description: "Offset for pagination (default: 0)",
        required: false,
    })
    offset: number = 0;

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    @ApiProperty({
        name: "pageSize",
        type: Number,
        description:
            "page size (number of results) for pagination (default: 30)",
        required: false,
    })
    pageSize: number = 30;

    @IsOptional()
    @ApiProperty({
        name: "sort",
        type: String,
        description:
            "Sort. - for descending, + (or nothing) for ascending (default: -createdAt)" +
            "<br/> Example: '+status;-createdAt' will sort by status ascending then createdAt descending" +
            "<br/> Valid sort fields are: 'status', 'createdAt', 'updatedAt'",
        required: false,
    })
    sort?: string;

    @ApiProperty({
        enum: soloProjectStatuses,
        required: false,
    })
    @IsOptional()
    @IsIn(soloProjectStatuses)
    status?: string;
}
