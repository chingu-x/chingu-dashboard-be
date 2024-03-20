import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { UpdateTeamMeetingDto } from "./dto/update-team-meeting.dto";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTeamMeetingDto } from "./dto/create-team-meeting.dto";
import { CreateAgendaDto } from "./dto/create-agenda.dto";
import { UpdateAgendaDto } from "./dto/update-agenda.dto";
import { CreateMeetingFormResponseDto } from "./dto/create-meeting-form-response.dto";
import { FormsService } from "../forms/forms.service";
import { UpdateMeetingFormResponseDto } from "./dto/update-meeting-form-response.dto";

@Injectable()
export class SprintsService {
    constructor(
        private prisma: PrismaService,
        private formServices: FormsService,
    ) {}

    private responseDtoToArray = (
        responses: CreateMeetingFormResponseDto | UpdateMeetingFormResponseDto,
    ) => {
        const responsesArray = [];
        for (const index in responses) {
            if (index !== "constructor") {
                responsesArray.push({
                    questionId: responses[index].questionId,
                    ...(responses[index].text
                        ? { text: responses[index].text }
                        : { text: null }),
                    ...(responses[index].numeric
                        ? { numeric: responses[index].numeric }
                        : { numeric: null }),
                    ...(responses[index].boolean
                        ? { boolean: responses[index].boolean }
                        : { boolean: null }),
                    ...(responses[index].optionChoiceId
                        ? { optionChoiceId: responses[index].optionChoiceId }
                        : { optionChoiceId: null }),
                });
            }
        }
        return responsesArray;
    };

    // this checks if the form with the given formId is of formType = "meeting"
    private isMeetingForm = async (formId) => {
        const form = await this.prisma.form.findUnique({
            where: {
                id: formId,
            },
            select: {
                formType: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!form)
            throw new BadRequestException(
                `Form (id: ${formId}) does not exist.`,
            );
        if (form?.formType?.name !== "meeting") {
            throw new BadRequestException(
                `Form (id: ${formId}) is not a meeting form.`,
            );
        }
        return !!form;
    };

    findSprintIdBySprintNumber = async (
        teamId: number,
        sprintNumber: number,
    ): Promise<number> | null => {
        const sprintsByTeamId = await this.prisma.voyageTeam.findUnique({
            where: {
                id: teamId,
            },
            include: {
                voyage: {
                    include: {
                        sprints: {
                            select: {
                                id: true,
                                number: true,
                            },
                        },
                    },
                },
            },
        });
        return sprintsByTeamId?.voyage?.sprints?.filter(
            (s) => s.number === sprintNumber,
        )[0]?.id;
    };

    async getVoyagesAndSprints() {
        return this.prisma.voyage.findMany({
            select: {
                id: true,
                number: true,
                soloProjectDeadline: true,
                certificateIssueDate: true,
                showcasePublishDate: true,
                startDate: true,
                endDate: true,
                sprints: {
                    select: {
                        id: true,
                        number: true,
                        startDate: true,
                        endDate: true,
                    },
                },
            },
        });
    }

    async getSprintDatesByTeamId(teamId: number) {
        const teamSprintDates = await this.prisma.voyageTeam.findUnique({
            where: {
                id: teamId,
            },
            select: {
                id: true,
                name: true,
                voyage: {
                    select: {
                        id: true,
                        number: true,
                        sprints: {
                            select: {
                                id: true,
                                number: true,
                                startDate: true,
                                endDate: true,
                            },
                        },
                    },
                },
            },
        });
        if (!teamSprintDates) {
            throw new NotFoundException(`Invalid teamId: ${teamId}`);
        }
        return teamSprintDates;
    }

    async getMeetingById(meetingId: number) {
        const teamMeeting = await this.prisma.teamMeeting.findUnique({
            where: {
                id: meetingId,
            },
            select: {
                id: true,
                sprint: {
                    select: {
                        id: true,
                        number: true,
                        startDate: true,
                        endDate: true,
                    },
                },
                title: true,
                dateTime: true,
                meetingLink: true,
                notes: true,
                agendas: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        status: true,
                    },
                },
                formResponseMeeting: {
                    select: {
                        id: true,
                        form: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                        responseGroup: {
                            select: {
                                responses: {
                                    select: {
                                        question: {
                                            select: {
                                                id: true,
                                                text: true,
                                                description: true,
                                                answerRequired: true,
                                            },
                                        },
                                        text: true,
                                        numeric: true,
                                        boolean: true,
                                        optionChoice: {
                                            select: {
                                                text: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!teamMeeting)
            throw new NotFoundException(
                `Meeting with id ${meetingId} not found`,
            );
        return teamMeeting;
    }

    async createTeamMeeting(
        teamId: number,
        sprintNumber: number,
        { title, meetingLink, dateTime, notes }: CreateTeamMeetingDto,
    ) {
        const sprintId = await this.findSprintIdBySprintNumber(
            teamId,
            sprintNumber,
        );
        if (!sprintId) {
            throw new NotFoundException(
                `Sprint number ${sprintNumber} or team Id ${teamId} does not exist.`,
            );
        }

        // check if the sprint already has a meeting.
        // This is temporary just remove this block when the app supports multiple meeting per sprint
        const isMeetingExist = await this.prisma.teamMeeting.findFirst({
            where: {
                sprintId: sprintId,
            },
        });

        if (isMeetingExist)
            throw new ConflictException(
                `A meeting already exist for this sprint.`,
            );
        // - End of temporary block

        return this.prisma.teamMeeting.create({
            data: {
                sprintId,
                voyageTeamId: teamId,
                title,
                meetingLink,
                dateTime,
                notes,
            },
        });
    }

    async updateTeamMeeting(
        meetingId: number,
        { title, meetingLink, dateTime, notes }: UpdateTeamMeetingDto,
    ) {
        try {
            const updatedMeeting = await this.prisma.teamMeeting.update({
                where: {
                    id: meetingId,
                },
                data: {
                    title,
                    meetingLink,
                    dateTime,
                    notes,
                },
            });
            return updatedMeeting;
        } catch (e) {
            if (e.code === "P2025") {
                throw new NotFoundException(`Invalid meetingId: ${meetingId}`);
            }
        }
    }

    async createMeetingAgenda(
        meetingId: number,
        { title, description, status }: CreateAgendaDto,
    ) {
        try {
            const newAgenda = await this.prisma.agenda.create({
                data: {
                    teamMeetingId: meetingId,
                    title,
                    description,
                    status,
                },
            });
            return newAgenda;
        } catch (e) {
            if (e.code === "P2003") {
                throw new BadRequestException(
                    `Invalid meetingId: ${meetingId}`,
                );
            }
        }
    }

    async updateMeetingAgenda(
        agendaId: number,
        { title, description, status }: UpdateAgendaDto,
    ) {
        try {
            const updatedMeeting = await this.prisma.agenda.update({
                where: {
                    id: agendaId,
                },
                data: {
                    title,
                    description,
                    status,
                },
            });
            return updatedMeeting;
        } catch (e) {
            if (e.code === "P2025") {
                throw new NotFoundException(`Invalid agendaId: ${agendaId}`);
            }
        }
    }

    async deleteMeetingAgenda(agendaId: number) {
        try {
            return await this.prisma.agenda.delete({
                where: {
                    id: agendaId,
                },
            });
        } catch (e) {
            if (e.code === "P2025") {
                throw new NotFoundException(
                    `${e.meta.cause} agendaId: ${agendaId}`,
                );
            }
        }
    }

    async addMeetingFormResponse(meetingId: number, formId: number) {
        if (await this.isMeetingForm(formId)) {
            try {
                const formResponseMeeting =
                    await this.prisma.formResponseMeeting.create({
                        data: {
                            formId,
                            meetingId,
                        },
                    });
                const updatedFormResponse =
                    await this.prisma.formResponseMeeting.update({
                        where: {
                            id: formResponseMeeting.id,
                        },
                        data: {
                            responseGroup: {
                                create: {},
                            },
                        },
                    });
                return updatedFormResponse;
            } catch (e) {
                if (e.code === "P2002") {
                    throw new ConflictException(
                        `FormId and MeetingId combination should be unique. Each meeting can only have at most 1 of each sprint review and sprint planning form.`,
                    );
                }
                if (e.code === "P2003") {
                    if (e.meta["field_name"].includes("formId")) {
                        throw new BadRequestException(
                            `FormId: ${formId} does not exist.`,
                        );
                    }
                    if (e.meta["field_name"].includes("meetingId")) {
                        throw new BadRequestException(
                            `MeetingId: ${meetingId} does not exist.`,
                        );
                    }
                }
            }
        }
    }

    async getMeetingFormQuestionsWithResponses(
        meetingId: number,
        formId: number,
    ) {
        const meeting = await this.prisma.teamMeeting.findUnique({
            where: {
                id: meetingId,
            },
        });

        if (!meeting)
            throw new NotFoundException(
                `Meeting with Id ${meetingId} does not exist.`,
            );

        const formResponseMeeting =
            await this.prisma.formResponseMeeting.findUnique({
                where: {
                    meetingFormId: {
                        meetingId,
                        formId,
                    },
                },
            });

        // this will also check if formId exist in getFormById
        if (!formResponseMeeting && (await this.isMeetingForm(formId)))
            return this.formServices.getFormById(formId);

        return this.prisma.form.findUnique({
            where: {
                id: formId,
            },
            select: {
                id: true,
                formType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                title: true,
                description: true,
                questions: {
                    select: {
                        id: true,
                        order: true,
                        inputType: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        text: true,
                        description: true,
                        answerRequired: true,
                        multipleAllowed: true,
                        optionGroup: {
                            select: {
                                optionChoices: {
                                    select: {
                                        id: true,
                                        text: true,
                                    },
                                },
                            },
                        },
                        responses: {
                            where: {
                                responseGroupId:
                                    formResponseMeeting.responseGroupId,
                            },
                            select: {
                                optionChoice: true,
                                numeric: true,
                                boolean: true,
                                text: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async updateMeetingFormResponse(
        meetingId: number,
        formId: number,
        responses: UpdateMeetingFormResponseDto,
    ) {
        // at this stage, it is unclear what id the frontend is able to send,
        // if they are able to send the fromResponseMeeting ID, then we won't need this step
        const formResponseMeeting =
            await this.prisma.formResponseMeeting.findUnique({
                where: {
                    meetingFormId: {
                        meetingId,
                        formId,
                    },
                },
                select: {
                    id: true,
                    responseGroupId: true,
                },
            });

        if (!formResponseMeeting) {
            throw new NotFoundException(
                `form response does not exist for meeting Id ${meetingId} and form Id ${formId}`,
            );
        }

        const responsesArray = this.responseDtoToArray(responses);

        // Checks that questions submitted for update match the form questions
        const form = await this.prisma.form.findUnique({
            where: { id: formId },
            select: {
                questions: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        const questionIds = form.questions.flatMap((question) => question.id);

        responsesArray.forEach((response) => {
            if (questionIds.indexOf(response.questionId) === -1)
                throw new BadRequestException(
                    `Question Id ${response.questionId} is not in form ${formId}`,
                );
        });

        return this.prisma.$transaction(
            responsesArray.map((response) => {
                const { questionId, ...data } = response;
                return this.prisma.response.upsert({
                    where: {
                        questionResponseGroup: {
                            responseGroupId:
                                formResponseMeeting.responseGroupId,
                            questionId: response.questionId,
                        },
                    },
                    update: data,
                    create: {
                        responseGroupId: formResponseMeeting.responseGroupId,
                        ...response,
                    },
                });
            }),
        );
    }
}
