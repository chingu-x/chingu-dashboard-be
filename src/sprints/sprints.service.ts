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
import { FormsService } from "@/forms/forms.service";
import { UpdateMeetingFormResponseDto } from "./dto/update-meeting-form-response.dto";
import { CreateCheckinFormDto } from "./dto/create-checkin-form.dto";
import { GlobalService } from "@/global/global.service";
import { FormTitles } from "@/global/constants/formTitles";
import { CustomRequest } from "@/global/types/CustomRequest";
import { CheckinQueryDto } from "./dto/get-checkin-form-response";
import { manageOwnVoyageTeamWithIdParam } from "@/ability/conditions/voyage-teams.ability";
import { manageOwnTeamMeetingOrAgendaById } from "@/ability/conditions/meetingOrAgenda.ability";
import { canSubmitCheckin } from "@/ability/conditions/sprints.ability";

@Injectable()
export class SprintsService {
    constructor(
        private prisma: PrismaService,
        private formServices: FormsService,
        private globalServices: GlobalService,
    ) {}

    // this checks if the form with the given formId is of formType = "meeting"
    private isMeetingForm = async (formId: number) => {
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
    ): Promise<number | undefined> => {
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

    async getSprintDatesByTeamId(teamId: number, req: CustomRequest) {
        manageOwnVoyageTeamWithIdParam(req.user, teamId);

        const teamSprintDates = await this.prisma.voyageTeam.findUnique({
            where: {
                id: teamId,
            },
            select: {
                id: true,
                name: true,
                endDate: true,
                teamMeetings: {
                    select: {
                        id: true,
                        sprintId: true,
                    },
                },
                voyage: {
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
                },
            },
        });

        if (!teamSprintDates) {
            throw new NotFoundException(`Invalid teamId: ${teamId}`);
        }

        const newSprints = teamSprintDates.voyage?.sprints.map((sprint) => {
            return {
                ...sprint,
                teamMeetings: teamSprintDates.teamMeetings
                    .filter((meeting) => meeting.sprintId === sprint.id)
                    .map((meeting) => meeting.id),
            };
        });

        return {
            ...teamSprintDates.voyage,
            sprints: newSprints,
        };
    }

    async getMeetingById(meetingId: number, req: CustomRequest) {
        const teamMeeting = await this.prisma.teamMeeting.findUnique({
            where: {
                id: meetingId,
            },
            select: {
                id: true,
                voyageTeamId: true,
                sprint: {
                    select: {
                        id: true,
                        number: true,
                        startDate: true,
                        endDate: true,
                    },
                },
                title: true,
                description: true,
                dateTime: true,
                meetingLink: true,
                notes: true,
                agendas: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        status: true,
                        updatedAt: true,
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
        manageOwnVoyageTeamWithIdParam(req.user, teamMeeting.voyageTeamId);
        return teamMeeting;
    }

    async createTeamMeeting(
        teamId: number,
        sprintNumber: number,
        {
            title,
            description,
            meetingLink,
            dateTime,
            notes,
        }: CreateTeamMeetingDto,
        req: CustomRequest,
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

        manageOwnVoyageTeamWithIdParam(req.user, teamId);

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
                description,
                meetingLink,
                dateTime,
                notes,
            },
        });
    }
    async updateTeamMeeting(
        meetingId: number,
        {
            title,
            description,
            meetingLink,
            dateTime,
            notes,
        }: UpdateTeamMeetingDto,
        req: CustomRequest,
    ) {
        await manageOwnTeamMeetingOrAgendaById({ user: req.user, meetingId });

        return this.prisma.teamMeeting.update({
            where: {
                id: meetingId,
            },
            data: {
                title,
                description,
                meetingLink,
                dateTime,
                notes,
            },
        });
    }

    async createMeetingAgenda(
        meetingId: number,
        { title, description, status }: CreateAgendaDto,
        req: CustomRequest,
    ) {
        await manageOwnTeamMeetingOrAgendaById({ user: req.user, meetingId });

        return this.prisma.agenda.create({
            data: {
                teamMeetingId: meetingId,
                title,
                description,
                status,
            },
        });
    }

    async updateMeetingAgenda(
        agendaId: number,
        { title, description, status }: UpdateAgendaDto,
        req: CustomRequest,
    ) {
        await manageOwnTeamMeetingOrAgendaById({ user: req.user, agendaId });
        return this.prisma.agenda.update({
            where: {
                id: agendaId,
            },
            data: {
                title,
                description,
                status,
            },
        });
    }

    async deleteMeetingAgenda(agendaId: number, req: CustomRequest) {
        await manageOwnTeamMeetingOrAgendaById({ user: req.user, agendaId });

        return this.prisma.agenda.delete({
            where: {
                id: agendaId,
            },
        });
    }

    async addMeetingFormResponse(
        meetingId: number,
        formId: number,
        req: CustomRequest,
    ) {
        const meeting = await this.prisma.teamMeeting.findUnique({
            where: {
                id: meetingId,
            },
            select: {
                voyageTeamId: true,
            },
        });
        if (!meeting) {
            throw new NotFoundException(
                `Meeting with Id ${meetingId} does not exist.`,
            );
        }
        manageOwnVoyageTeamWithIdParam(req.user, meeting.voyageTeamId);
        if (await this.isMeetingForm(formId)) {
            try {
                const formResponseMeeting =
                    await this.prisma.formResponseMeeting.create({
                        data: {
                            formId,
                            meetingId,
                        },
                        select: {
                            id: true,
                            meeting: {
                                select: {
                                    voyageTeamId: true,
                                },
                            },
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
                }

                throw e;
            }
        }
    }

    async getMeetingFormQuestionsWithResponses(
        meetingId: number,
        formId: number,
        req: CustomRequest,
    ) {
        const meeting = await this.prisma.teamMeeting.findUnique({
            where: {
                id: meetingId,
            },
            select: {
                voyageTeamId: true,
            },
        });

        if (!meeting)
            throw new NotFoundException(
                `Meeting with Id ${meetingId} does not exist.`,
            );

        manageOwnVoyageTeamWithIdParam(req.user, meeting.voyageTeamId);

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
            return this.formServices.getFormById(formId, req);

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
                        parseConfig: true,
                        optionGroup: {
                            select: {
                                optionChoices: {
                                    select: {
                                        id: true,
                                        text: true,
                                        parseConfig: true,
                                    },
                                },
                            },
                        },
                        responses: {
                            where: {
                                responseGroupId:
                                    formResponseMeeting?.responseGroupId,
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
        req: CustomRequest,
    ) {
        const meeting = await this.prisma.teamMeeting.findUnique({
            where: {
                id: meetingId,
            },
            select: {
                voyageTeamId: true,
            },
        });
        if (!meeting) {
            throw new NotFoundException(
                `Meeting with Id ${meetingId} does not exist.`,
            );
        }
        manageOwnVoyageTeamWithIdParam(req.user, meeting.voyageTeamId);
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

        const responsesArray =
            this.globalServices.responseDtoToArray(responses);

        await this.globalServices.checkQuestionsInFormById(
            formId,
            responsesArray,
        );

        return this.prisma.$transaction(
            async (tx) =>
                await Promise.all(
                    responsesArray.map(async (response) => {
                        const responseToUpdate = await tx.response.findFirst({
                            where: {
                                responseGroupId:
                                    formResponseMeeting.responseGroupId,
                                questionId: response.questionId,
                            },
                        });

                        // if response does not already exist, update
                        // (this happens for a fresh meeting form)
                        // else create a new response
                        if (!responseToUpdate) {
                            return tx.response.create({
                                data: {
                                    responseGroupId:
                                        formResponseMeeting.responseGroupId,
                                    ...response,
                                },
                            });
                        }
                        return tx.response.update({
                            where: {
                                id: responseToUpdate.id,
                            },
                            data: {
                                responseGroupId:
                                    formResponseMeeting.responseGroupId,
                                ...response,
                            },
                        });
                    }),
                ),
        );
    }

    async addCheckinFormResponse(createCheckinForm: CreateCheckinFormDto) {
        const responsesArray =
            this.globalServices.responseDtoToArray(createCheckinForm);

        await this.globalServices.checkQuestionsInFormByTitle(
            [
                FormTitles.sprintCheckin,
                FormTitles.sprintCheckinPO,
                FormTitles.sprintCheckinSM,
            ],
            responsesArray,
        );

        // TODO: find way to inject globalServices directly
        await canSubmitCheckin(
            createCheckinForm.sprintId,
            createCheckinForm.voyageTeamMemberId,
            this.globalServices.validateOrGetDbItem,
        );

        try {
            const checkinSubmission = await this.prisma.$transaction(
                async (tx) => {
                    const responseGroup = await tx.responseGroup.create({
                        data: {
                            responses: {
                                createMany: {
                                    data: responsesArray,
                                },
                            },
                        },
                    });

                    return tx.formResponseCheckin.create({
                        data: {
                            voyageTeamMemberId:
                                createCheckinForm.voyageTeamMemberId,
                            sprintId: createCheckinForm.sprintId,
                            responseGroupId: responseGroup.id,
                        },
                    });
                },
            );
            return {
                id: checkinSubmission.id,
                voyageTeamMemberId: checkinSubmission.voyageTeamMemberId,
                sprintId: checkinSubmission.sprintId,
                responseGroupId: checkinSubmission.responseGroupId,
                createdAt: checkinSubmission.createdAt,
            };
        } catch (e) {
            if (e.code === "P2002") {
                throw new ConflictException(
                    `User ${createCheckinForm.voyageTeamMemberId} has already submitted a checkin form for sprint id ${createCheckinForm.sprintId}.`,
                );
            }
            if (e.name === "PrismaClientValidationError") {
                throw new BadRequestException(
                    `Bad request - type error in responses array`,
                );
            } else {
                console.log(e);
                throw e;
            }
        }
    }

    async getCheckinFormResponse(query: CheckinQueryDto) {
        const queryToExecute = await this.buildQuery(query);

        const checkinFormResponses = await this.executeQuery(queryToExecute);

        // make responses uniform and get rid of empty arrays
        const uniformResponses = checkinFormResponses.flatMap(
            (item) => item.checkinForms || [item],
        );
        const filteredUniformResponses = uniformResponses.filter(
            (item) => Object.keys(item).length > 0,
        );

        // if no matches, return empty array and status code 200
        if (filteredUniformResponses.length < 1) {
            return [];
        }

        return filteredUniformResponses;
    }

    private async buildQuery(inputQuery: CheckinQueryDto): Promise<any> {
        const keyValPairs: Array<[string, string | string | number]> =
            Object.entries(inputQuery).filter(([_, v]) => v);

        // query stores arguments to "where: " clause in Prisma query
        const query: Record<string, any> = {};
        const keyIndex = 0;
        const valIndex = 1;

        for (let i = 0; i < keyValPairs.length; i++) {
            const currentKey = keyValPairs[i][keyIndex];
            const currentVal = keyValPairs[i][valIndex];

            switch (currentKey) {
                case "sprintNumber":
                    // make sure this (key: val) exists in db
                    await this.globalServices.validateOrGetDbItem(
                        "sprint",
                        currentVal as number,
                        "number",
                        "findFirst",
                    );
                    // query.* subfields must be initialized to {} first if null
                    query.sprint = query.sprint || {};
                    query.sprint = {
                        ...query.sprint,
                        number: currentVal,
                    };
                    break;
                case "teamId":
                    await this.globalServices.validateOrGetDbItem(
                        "voyageTeam",
                        currentVal as number,
                    );
                    query.voyageTeamMember = query.voyageTeamMember || {};
                    query.voyageTeamMember.voyageTeamId = currentVal;
                    break;
                case "voyageNumber":
                    await this.globalServices.validateOrGetDbItem(
                        "voyage",
                        currentVal as string,
                        "number",
                    );
                    query.sprint = query.sprint || {};
                    query.sprint.voyage = { number: currentVal };
                    break;
                case "userId":
                    await this.globalServices.validateOrGetDbItem(
                        "user",
                        currentVal as string,
                    );
                    query.voyageTeamMember = query.voyageTeamMember || {};
                    query.voyageTeamMember.userId = currentVal;
                    break;
                default:
                    throw new BadRequestException(
                        `Query ${currentKey} did not match any keywords`,
                    );
            }
        }

        return query;
    }

    private async executeQuery(query: Record<string, any>): Promise<any> {
        return this.prisma.formResponseCheckin.findMany({
            where: query,
            include: {
                voyageTeamMember: {
                    select: {
                        voyageTeamId: true,
                    },
                },
                sprint: {
                    select: {
                        number: true,
                        voyage: {
                            select: {
                                number: true,
                            },
                        },
                    },
                },
                responseGroup: {
                    select: {
                        responses: {
                            include: {
                                question: true,
                                optionChoice: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                voyageTeamMember: {
                    voyageTeamId: "asc",
                },
            },
        });
    }
}
