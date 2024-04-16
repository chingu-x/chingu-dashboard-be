import { IsDate, IsOptional, IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateTeamMeetingDto {
    @IsString()
    @ApiProperty({
        description: "title of the meeting",
        example: "Sprint Planning",
    })
    title: string;

    @IsString()
    @ApiProperty({
        description: "description of the meeting",
        example:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit magna praesent, nunc metus egestas nam libero quisque senectus facilisis, dis nec gravida sodales sagittis duis risus parturient. Eu scelerisque gravida posuere blandit interdum iaculis venenatis rhoncus taciti, tempus nullam cras eros quisque himenaeos condimentum auctor cursus, leo neque montes mollis litora imperdiet luctus purus.",
    })
    description: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    @ApiProperty()
    dateTime: Date;

    @IsOptional()
    @IsUrl(
        {
            require_protocol: false,
            require_port: false,
            allow_underscores: true,
        },
        { message: "Meeting url is not valid." },
    )
    @ApiProperty({
        example: "samplelink.com/meeting1234",
    })
    // TODO: sanitizeHtml didn't work so will leave this out till later
    // it returns an empty string for everything
    //@Transform((params:TransformFnParams) => sanitizeHtml(params))
    meetingLink: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: "Notes for the meeting",
    })
    notes: string;
}
