import { ApiProperty } from "@nestjs/swagger";
import { Optional } from "@nestjs/common";
import { ResponseGroup } from "../forms/forms.response";

class Sprint {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    number: number;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    startDate: Date;

    @ApiProperty({ example: "2024-01-14T00:00:00.000Z" })
    endDate: Date;

    @ApiProperty({ isArray: true, example: [1] })
    teamMeetings: number;
}

class SprintWithoutMeetings {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    number: number;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    startDate: Date;

    @ApiProperty({ example: "2024-01-14T00:00:00.000Z" })
    endDate: Date;
}

export class VoyageResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "47" })
    number: string;

    @ApiProperty({ example: "2023-12-31T00:00:00.000Z" })
    soloProjectDeadline: Date;

    @ApiProperty({ example: "2024-02-25T00:00:00.000Z" })
    certificateIssueDate: Date;

    @ApiProperty({ example: null })
    @Optional()
    showcasePublishDate: Date;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    startDate: Date;

    @ApiProperty({ example: "2024-02-18T00:00:00.000Z" })
    endDate: Date;

    @ApiProperty({ isArray: true })
    sprints: Sprint;
}

export class VoyageResponseWithoutMeetings {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "47" })
    number: string;

    @ApiProperty({ example: "2023-12-31T00:00:00.000Z" })
    soloProjectDeadline: Date;

    @ApiProperty({ example: "2024-02-25T00:00:00.000Z" })
    certificateIssueDate: Date;

    @ApiProperty({ example: null })
    @Optional()
    showcasePublishDate: Date;

    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    startDate: Date;

    @ApiProperty({ example: "2024-02-18T00:00:00.000Z" })
    endDate: Date;

    @ApiProperty({ isArray: true })
    sprints: SprintWithoutMeetings;
}

class Agenda {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Project Management Tools" })
    title: string;

    @ApiProperty({
        example:
            "Walk the team through how the Jira board is organized and how we will coordinate communications and tickets.",
    })
    description: string;

    @ApiProperty({ example: false })
    status: boolean;
}

class AgendaMeetingResponse extends Agenda {
    @ApiProperty({ example: "2023-11-30T06:47:11.694Z" })
    updatedAt: Date;
}

export class MeetingResponseWithSprintAndAgenda {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty()
    sprint: Sprint;

    @ApiProperty({ example: "First sprint kickoff meeting" })
    title: string;

    @ApiProperty({
        example:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit magna praesent, nunc metus egestas nam libero quisque senectus facilisis, dis nec gravida sodales sagittis duis risus parturient. Eu scelerisque gravida posuere blandit interdum iaculis venenatis rhoncus taciti, tempus nullam cras eros quisque himenaeos condimentum auctor cursus, leo neque montes mollis litora imperdiet luctus purus.",
    })
    description: string;

    @Optional()
    @ApiProperty({ example: "2024-01-08T00:00:00.000Z" })
    dateTime: Date;

    @Optional()
    @ApiProperty({ example: "meet.google.com/abcdefg" })
    meetingLink: string;

    @Optional()
    @ApiProperty({ example: "Meeting notes" })
    notes: string;

    @ApiProperty({ isArray: true })
    agendas: AgendaMeetingResponse;
}

export class MeetingResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    sprintId: number;

    @ApiProperty({ example: "Sprint Planning" })
    title: string;

    @ApiProperty({
        example:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit magna praesent, nunc metus egestas nam libero quisque senectus facilisis, dis nec gravida sodales sagittis duis risus parturient. Eu scelerisque gravida posuere blandit interdum iaculis venenatis rhoncus taciti, tempus nullam cras eros quisque himenaeos condimentum auctor cursus, leo neque montes mollis litora imperdiet luctus purus.",
    })
    description: string;

    @Optional()
    @ApiProperty({ example: "2023-12-02T13:37:51.465Z" })
    dateTime: Date;

    @Optional()
    @ApiProperty({ example: "samplelink.com/meeting1234" })
    meetingLink: string;

    @Optional()
    @ApiProperty({ example: "Notes for the meeting" })
    notes: string;

    @ApiProperty({ example: "2023-11-30T06:47:11.694Z" })
    createdAt: Date;

    @ApiProperty({ example: "2023-11-30T06:47:11.694Z" })
    updatedAt: Date;
}

export class AgendaResponse extends Agenda {
    @ApiProperty({ example: 1 })
    teamMeetingId: number;

    @ApiProperty({ example: "2023-11-30T06:47:11.694Z" })
    createdAt: Date;

    @ApiProperty({ example: "2023-11-30T06:47:11.694Z" })
    updatedAt: Date;
}

export class MeetingFormResponse {
    @ApiProperty({ example: 4 })
    id: number;

    @ApiProperty({ example: 1 })
    formId: number;

    @ApiProperty({ example: 2 })
    meetingId: number;

    @ApiProperty({ example: "2023-11-30T06:47:11.694Z" })
    createdAt: Date;

    @ApiProperty({ example: "2023-11-30T06:47:11.694Z" })
    updatedAt: Date;

    @ApiProperty({ example: 5 })
    responseGroupId: number;
}

export class CheckinSubmissionResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    voyageTeamMemberId: number;

    @ApiProperty({ example: 1 })
    sprintId: number;

    @ApiProperty({ example: 1 })
    responseGroupId: 5;

    @ApiProperty({ example: "2023-11-30T06:47:11.694Z" })
    createdAt: Date;
}

export class CheckinFormResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    voyageTeamMemberId: number;

    @ApiProperty({ example: 1 })
    voyageTeamId: number;

    @ApiProperty({ example: 1 })
    sprintId: number;

    @ApiProperty({ example: "Great job!" })
    adminComments: string;

    @ApiProperty({ example: true })
    feedbackSent: boolean;

    @ApiProperty({ isArray: true })
    responseGroup: ResponseGroup;

    @ApiProperty({ example: "2023-11-30T06:47:11.694Z" })
    createdAt: Date;

    @ApiProperty({ example: "2023-11-30T06:47:11.694Z" })
    updatedAt: Date;
}
