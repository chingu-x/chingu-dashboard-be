import {
    IsEmail,
    IsIn,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Min,
} from "class-validator";
import { Type } from "class-transformer";
import { soloProjectStatuses } from "@/global/constants/statuses";
import { ApiProperty } from "@nestjs/swagger";
import { soloProjectVoyageRoles } from "@/global/constants/roles";

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
            "<br/> Valid sort fields are: 'status', 'createdAt', 'updatedAt'" +
            "<br/> Default: '-createdAt'",
        required: false,
    })
    sort: string = "-createdAt";

    @ApiProperty({
        enum: soloProjectStatuses,
        required: false,
    })
    @IsOptional()
    @IsIn(soloProjectStatuses)
    status: string;

    @ApiProperty({
        enum: soloProjectVoyageRoles,
        required: false,
    })
    @IsOptional()
    @IsIn(soloProjectVoyageRoles)
    voyageRoles: string;

    @ApiProperty({
        required: false,
        description: "User email",
    })
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiProperty({
        required: false,
        description: "Discord ID, not discord nickname",
    })
    @IsOptional()
    @IsString()
    discordId: string;
}
