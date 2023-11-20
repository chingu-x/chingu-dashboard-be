import { PartialType } from "@nestjs/swagger";
import { CreateTeamMeetingDto } from "./create-team-meeting.dto";

export class UpdateTeamMeetingDto extends PartialType(CreateTeamMeetingDto) {}
