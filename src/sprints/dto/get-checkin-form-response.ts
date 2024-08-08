import { IsOptional, IsUUID, IsInt, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class CheckinQueryDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    teamId?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(6)
    @Type(() => Number)
    sprintNumber?: number;

    @IsOptional()
    voyageNumber?: string;

    @IsOptional()
    @IsUUID()
    userId?: string;
}
