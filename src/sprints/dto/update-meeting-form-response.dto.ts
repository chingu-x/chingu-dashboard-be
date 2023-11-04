import {PartialType} from "@nestjs/swagger";
import {CreateMeetingFormResponseDto} from "./create-meeting-form-response.dto";

export class UpdateMeetingFormResponseDto extends PartialType(CreateMeetingFormResponseDto) {}