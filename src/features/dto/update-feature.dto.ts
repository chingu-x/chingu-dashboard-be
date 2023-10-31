import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatureDto } from './create-feature.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {
    @ApiProperty()
    teamMemberId: number;

    @IsNotEmpty()
    @ApiProperty()
    featureCategoryId: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
}
