import {
  Sprint,
  Question,
      OptionChoice,
  FormResponseCheckin,
    Response,
FormResponseVoyageProject,
    Prisma,
} from "@prisma/client";
import { CustomRequest } from "@/global/types/CustomRequest";
import { CreateTeamMeetingDto } from "./dto/create-team-meeting.dto";
import { CreateCheckinFormDto } from "./dto/create-checkin-form.dto";
import { prismaMock } from "@/prisma/singleton";
import { manageOwnTeamMeetingOrAgendaById } from "@/ability/conditions/meetingOrAgenda.ability";
import { FormsService } from "@/forms/forms.service";
import { GlobalService } from "@/global/global.service";
import { PrismaService } from "@/prisma/prisma.service";
import { TestingModule, Test } from "@nestjs/testing";
import { SprintsService } from "./sprints.service";
import { VoyageResponse } from "./sprints.response";

// Define types with relations using Prisma's type helpers
type TeamMeetingWithRelations = Prisma.TeamMeetingGetPayload<{
    include: {
        sprint: true;
        agendas: true;
        formResponseMeeting: {
            include: {
                form: true;
                responseGroup: {
                    include: {
                        responses: {
                            include: {
                                question: true;
                                optionChoice: true;
                            };
                        };
                    };
                };
            };
        };
    };
}>;

type FormResponseMeetingWithRelations = Prisma.FormResponseMeetingGetPayload<{
    include: {
        form: true;
        meeting: true;
        responseGroup: {
            include: {
                responses: {
                    include: {
                        question: true;
                        optionChoice: true;
                    };
                };
            };
        };
    };
}>;

type FormResponseWithRelations = Prisma.FormResponseMeetingGetPayload<{
    include: {
        form: true;
        responseGroup: {
            include: {
                responses: {
                    include: {
                        question: true;
                        optionChoice: true;
                    };
                };
            };
        };
    };
}>;
type ResponseWithRelations = Response & {
    question: Question;
    optionChoice: OptionChoice | null;
};
type AgendaWithRelations = Prisma.AgendaGetPayload<{
    include: {
        teamMeeting: true;
    };
}>;

type VoyageWithRelations = Prisma.VoyageGetPayload<{
    include: {
        sprints: true;
    };
}>;

type MockFormResponseMeetingWithRelations = Omit<
    FormResponseMeetingWithRelations,
    "meeting" | "form" | "responseGroup"
> & {
    meeting?: FormResponseMeetingWithRelations["meeting"] | null;
    form?: FormResponseMeetingWithRelations["form"] | null;
    responseGroup?: FormResponseMeetingWithRelations["responseGroup"] | null;
};

type MockAgendaWithRelations = Omit<AgendaWithRelations, "teamMeeting"> & {
    teamMeeting?: AgendaWithRelations["teamMeeting"] | null;
};

 export const mockDate = new Date("2024-10-23T02:41:03.575Z");
 export const createMockData = {
        date: mockDate,
        user: {
            userId: "aa9d050e-5756-4c3c-bc04-071f39f53663",
            email: "test@test.com",
            roles: ["admin"],
            isVerified: true,
            voyageTeams: [1],
        },
        request: {
            user: {
                userId: "aa9d050e-5756-4c3c-bc04-071f39f53663",
                email: "test@test.com",
                roles: ["admin"],
                isVerified: true,
                voyageTeams: [1],
            },
        } as any as CustomRequest,
        voyage: (
            partial: Partial<VoyageWithRelations> = {},
        ): VoyageWithRelations => ({
            id: 1,
            number: "47",
            statusId: null,
            soloProjectDeadline: mockDate,
            certificateIssueDate: mockDate,
            showcasePublishDate: null,
            startDate: mockDate,
            endDate: mockDate,
            createdAt: mockDate,
            updatedAt: mockDate,
            sprints: [],
            ...partial,
        }),
        sprint: (
            id: number,
            number: number,
            partial: Partial<Sprint> = {},
        ): Sprint => ({
            id,
            number,
            voyageId: 1,
            startDate: mockDate,
            endDate: mockDate,
            createdAt: mockDate,
            updatedAt: mockDate,
            ...partial,
        }),
        meeting: (
            id: number,
            partial: Partial<TeamMeetingWithRelations> = {},
        ): TeamMeetingWithRelations => ({
            id,
            sprintId: 1,
            voyageTeamId: 1,
            title: "Test Meeting",
            description: "Test description",
            dateTime: mockDate,
            meetingLink: "http://test.com",
            notes: "Test Notes",
            createdAt: mockDate,
            updatedAt: mockDate,
            sprint: {
                id: 1,
                number: 1,
                voyageId: 1,
                startDate: mockDate,
                endDate: mockDate,
                createdAt: mockDate,
                updatedAt: mockDate,
            },
            agendas: [],
            formResponseMeeting: [],
            ...partial,
        }),
        agenda: (
            id: number,
            partial: Partial<MockAgendaWithRelations> = {},
        ): MockAgendaWithRelations => ({
            id,
            teamMeetingId: 1,
            title: "Test Agenda",
            description: "Test Description",
            status: false,
            createdAt: mockDate,
            updatedAt: mockDate,
            teamMeeting: null,
            ...partial,
        }),
        formResponse: (
            id: number,
            partial: Partial<FormResponseWithRelations> = {},
        ): FormResponseWithRelations => ({
            id,
            formId: 1,
            meetingId: 1,
            responseGroupId: 1,
            createdAt: mockDate,
            updatedAt: mockDate,
            form: {
                id: 1,
                title: "Test Form",
                description: null,
                formTypeId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            },
            responseGroup: {
                id: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
                responses: [],
            },
            ...partial,
        }),
        question: (id: number, partial: Partial<Question> = {}) => ({
        id,
        formId: 1,
        text: "Sample Question Text",
        description: "Sample Question Description",
        order: 1,
        inputTypeId: 1,
        answerRequired: true,
        multipleAllowed: null,
        optionGroupId: null,
        parentQuestionId: null,
        createdAt: mockDate,
        updatedAt: mockDate,
        ...partial
    }),
        response: (questionId: number, text: string | null, partial: Partial<ResponseWithRelations> = {}): ResponseWithRelations => ({
            id: 1,
            questionId,
            responseGroupId: 1,
            text,
            numeric: null,
            boolean: null,
            optionChoiceId: null,
            createdAt: mockDate,
          updatedAt: mockDate,
             question: createMockData.question(1),
        optionChoice: null,
        ...partial,
        }),

        checkinFormResponse: (
            id: number,
            partial: Partial<FormResponseCheckin> = {},
        ) => ({
            id,
            voyageTeamMemberId: 1,
            sprintId: 1,
            responseGroupId: 1,
            adminComments: null,
            feedbackSent: false,
            createdAt: mockDate,
            updatedAt: mockDate,
            ...partial,
        }),
        checkinFormDto: (partial: Partial<CreateCheckinFormDto> = {}) => ({
            voyageTeamMemberId: 1,
            sprintId: 1,
            responses: [createMockData.response(1, "Check-in response")],
            ...partial,
        }),
        createTeamMeetingDto: (
            partial: Partial<CreateTeamMeetingDto> = {},
        ): CreateTeamMeetingDto => ({
            title: "Sprint Planning",
            description: "Planning session for sprint 1",
            meetingLink: "http://meet.google.com/123",
            dateTime: mockDate,
            notes: "Please come prepared",
            ...partial,
        }),

        // Similarly for update DTO
        updateTeamMeetingDto: (
            partial: Partial<CreateTeamMeetingDto> = {},
        ): CreateTeamMeetingDto => ({
            title: "Updated Sprint Planning",
            description: "Updated planning session",
            meetingLink: "http://meet.google.com/456",
            dateTime: mockDate,
            notes: "Updated notes",
            ...partial,
        }),
        formWithQuestions: (id: number, partial: Partial<any> = {}) => ({
            id,
            formType: {
                id: 1,
                name: "meeting",
            },
            title: "Test Form",
            description: null,
            questions: [
                {
                    id: 1,
                    order: 1,
                    inputType: {
                        id: 1,
                        name: "text",
                    },
                    text: "Question 1",
                    description: "Description 1",
                    answerRequired: true,
                    multipleAllowed: null,
                    optionGroup: {
                        optionChoices: [],
                    },
                    responses: [],
                },
            ],
            ...partial,
        }),

        formResponseMeetingWithId: (meetingId: number, formId: number) => ({
            meetingFormId: {
                meetingId,
                formId,
            },
            responseGroupId: 1,
        }),
        sprintWithTeamMeetings: (id: number, number: number, teamMeetings: number[] = []) => ({
        id,
        number,
        startDate: mockDate,
        endDate: mockDate,
        teamMeetings
    }),

    voyageWithSprints: (partial: Partial<FormResponseVoyageProject> = {}) => ({
        id: 1,
        number: "47",
        soloProjectDeadline: mockDate,
        certificateIssueDate: mockDate,
        showcasePublishDate: null,
        startDate: mockDate,
        endDate: mockDate,
        sprints: [
            createMockData.sprintWithTeamMeetings(1, 1, [1, 2]),
            createMockData.sprintWithTeamMeetings(2, 2, [3])
        ],
        ...partial
    })
    };

  export const helpers = {
        createTestModule: async () => {
            const mockFormsService = { getFormById: jest.fn() };

            const mockGlobalService = {
                responseDtoToArray: jest.fn(),
                checkQuestionsInFormById: jest.fn(),
                validateOrGetDbItem: jest.fn(),
                checkQuestionsInFormByTitle: jest.fn(),
            };
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    SprintsService,
                    { provide: PrismaService, useValue: prismaMock },
                    { provide: GlobalService, useValue: mockGlobalService },
                    { provide: FormsService, useValue: mockFormsService },
                ],
            }).compile();

            return {
                service: module.get<SprintsService>(SprintsService),
                formService: module.get<FormsService>(FormsService),
                globalService: module.get<GlobalService>(GlobalService),
            };
        },
        setupAbilityCheck: (
            implementation = () => Promise.resolve(undefined),
        ) => {
            (manageOwnTeamMeetingOrAgendaById as jest.Mock).mockClear();
            (manageOwnTeamMeetingOrAgendaById as jest.Mock).mockImplementation(
                implementation,
            );
        },
        setupPrismaMock: {
            meeting: (meeting: Partial<TeamMeetingWithRelations> = {}) => {
                prismaMock.teamMeeting.findUnique.mockResolvedValue(
                    createMockData.meeting(1, meeting),
                );
            },
            agenda: (agenda: Partial<AgendaWithRelations> = {}) => {
                prismaMock.agenda.findUnique.mockResolvedValue(
                    createMockData.agenda(1, agenda),
                );
            },
            formResponse: (
                formResponse: Partial<FormResponseWithRelations> = {},
            ) => {
                prismaMock.formResponseMeeting.findUnique.mockResolvedValue(
                    createMockData.formResponse(1, formResponse),
                );
            },
        },
        setupTransactionMock: (returnValue: any) => {
            prismaMock.$transaction.mockImplementation(async (callback) => {
                if (typeof callback === "function") {
                    return callback(prismaMock);
                }
                return returnValue;
            });
        },
        // Add helper function to create voyage with sprints
        createVoyageWithSprints: () => {
            const sprint1 = createMockData.sprint(1, 1);
            const sprint2 = createMockData.sprint(2, 2);

            return [
                createMockData.voyage({
                    sprints: [sprint1, sprint2],
                }),
            ];
        },
    };