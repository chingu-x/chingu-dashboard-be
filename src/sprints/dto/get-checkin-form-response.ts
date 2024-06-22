import { IsOptional, IsUUID, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class CheckinQueryDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    teamId?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    sprintNumber?: number;

    @IsOptional()
    voyageNumber?: string;

    @IsOptional()
    @IsUUID()
    userId?: string;
}
