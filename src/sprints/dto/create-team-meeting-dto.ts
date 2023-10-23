import {IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Transform, TransformFnParams, Type} from "class-transformer";
import * as sanitizeHtml from 'sanitize-html';

export class CreateTeamMeetingDto {
    @IsString()
    @ApiProperty({
        description: 'title of the meeting'
    })
    @Transform((params:TransformFnParams) => sanitizeHtml(params))
    title: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    @ApiProperty()
    dateTime: Date;

    @IsOptional()
    @IsUrl({
        require_protocol: false
    }, { message: 'Meeting url is not valid.' })
    @ApiProperty()
    @Transform((params:TransformFnParams) => sanitizeHtml(params))
    meetingLink: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    @Transform((params:TransformFnParams) => sanitizeHtml(params))
    notes: string;
}