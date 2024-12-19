import { Test, TestingModule } from "@nestjs/testing";
import { SprintsController } from "./sprints.controller";
import { SprintsService } from "./sprints.service";
import { CustomRequest } from "@/global/types/CustomRequest";
import { createMockData, mockDate } from "../global/mocks/mock-data";
import { CreateTeamMeetingDto } from "./dto/create-team-meeting.dto";
import { UpdateTeamMeetingDto } from "./dto/update-team-meeting.dto";
import { CreateAgendaDto } from "./dto/create-agenda.dto";
import { UpdateAgendaDto } from "./dto/update-agenda.dto";
import { UpdateMeetingFormResponseDto } from "./dto/update-meeting-form-response.dto";
import { CreateCheckinFormDto } from "./dto/create-checkin-form.dto";
import {
    AgendaResponse,
    CheckinFormResponse,
    CheckinSubmissionResponse,
    MeetingFormResponse,
    MeetingResponse,
} from "./sprints.response";
import { CheckinQueryDto } from "./dto/get-checkin-form-response";

describe("SprintsController", () => {
    let sprintsController: SprintsController;
    let sprintsService: SprintsService;

    const mockRequest = createMockData.request as unknown as CustomRequest;

    const mockFormResponseMeeting: MeetingFormResponse = {
        id: 1,
        meetingId: 1,
        formId: 1,
        responseGroupId: 1,
        createdAt: mockDate,
        updatedAt: mockDate,
    };
    const mockFormWithQuestionsResponse = createMockData.formWithQuestions(
        1,
        mockFormResponseMeeting,
    );

    const mockCreateMeetingDto: CreateTeamMeetingDto = {
        title: "Sprint Planning",
        description: "Planning session for sprint 1",
        meetingLink: "http://meet.google.com/123",
        dateTime: mockDate,
        notes: "Please come prepared",
    };

    const mockUpdatedMeetingDto: UpdateTeamMeetingDto = {
        title: "Updated Sprint Meeting",
        description: "Updated Planning session for sprint 1",
        meetingLink: "http://meet.google.com/123Updated",
        dateTime: mockDate,
        notes: "Updated Please come prepared",
    };

    const mockCreateAgendaDto: CreateAgendaDto = {
        title: "Sprint Planning",
        description: "Planning session for sprint 1",
        status: true,
    };

    const mockUpdatedAgendaDto: UpdateAgendaDto = {
        title: "Updated Sprint Planning",
        description: "Updated Planning session for sprint 1" ?? null,
        status: true,
    };

    const mockUpdateMeetingFormResponseDto: UpdateMeetingFormResponseDto = {
        responses: [
            {
                questionId: 1,
                optionChoiceId: 1,
                text: "Answer 1",
                numeric: 1,
                boolean: true,
            },
        ],
    };

    const mockCreateCheckinFormDto: CreateCheckinFormDto = {
        sprintId: 1,
        voyageTeamMemberId: 1,
        responses: [
            {
                questionId: 1,
                text: "Test response",
            },
        ],
    };

    const mockUpdateMeetingFormResponse = {
        id: 1,
        text: "updated response",
        createdAt: mockDate,
        updatedAt: mockDate,
        ...mockUpdateMeetingFormResponseDto.responses?.[0],
    };
    const mockCreatedAgenda: AgendaResponse = {
        id: 1,
        teamMeetingId: 1,
        createdAt: mockDate,
        updatedAt: mockDate,
        ...mockCreateAgendaDto,
    };

    const mockUpdatedAgenda: AgendaResponse = {
        id: 1,
        teamMeetingId: 1,
        createdAt: mockDate,
        updatedAt: mockDate,
        description: "Updated Agenda description",
        status: true,
        title: "Updated Agenda title",
    };

    const mockDeletedAgenda: AgendaResponse = {
        id: 1,
        teamMeetingId: 1,
        title: "Deleted Agenda",
        description: "Agenda to be deleted",
        status: false,
        createdAt: mockDate,
        updatedAt: mockDate,
    };

    const mockCreatedMeeting: MeetingResponse & { voyageTeamId: number } = {
        id: 1,
        sprintId: 1,
        createdAt: mockDate,
        updatedAt: mockDate,
        voyageTeamId: 1,
        ...mockCreateMeetingDto,
    };

    const mockUpdatedMeeting: MeetingResponse & { voyageTeamId: number } = {
        id: 1,
        sprintId: 1,
        createdAt: mockDate,
        updatedAt: mockDate,
        voyageTeamId: 1,
        title: "Updated Meeting title",
        description: "Updated Meeting description",
        dateTime: mockDate,
        meetingLink: "https://meet.test.com/updated",
        notes: "Updated notes",
    };
    const sprintsServiceMock = {
        getVoyagesAndSprints: jest.fn(),
        getSprintDatesByTeamId: jest.fn(),
        getMeetingById: jest.fn(),
        createTeamMeeting: jest.fn(),
        updateTeamMeeting: jest.fn(),
        createMeetingAgenda: jest.fn(),
        updateMeetingAgenda: jest.fn(),
        deleteMeetingAgenda: jest.fn(),
        addMeetingFormResponse: jest.fn(),
        getMeetingFormQuestionsWithResponses: jest.fn(),
        updateMeetingFormResponse: jest.fn(),
        addCheckinFormResponse: jest.fn(),
        getCheckinFormResponse: jest.fn(),
    } as unknown as SprintsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SprintsController],
            providers: [
                {
                    provide: SprintsService,
                    useValue: sprintsServiceMock,
                },
            ],
        }).compile();

        sprintsController = await module.resolve(SprintsController);
        sprintsService = await module.resolve(SprintsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getVoyagesAndSprints", () => {
        it("should have getVoyagesAndSprints function defined", () => {
            expect(sprintsController.getVoyagesAndSprints).toBeDefined();
        });

        it("should have sprintService.getVoyagesAndSprints defined", () => {
            expect(sprintsService.getVoyagesAndSprints).toBeDefined();
        });

        it("should return voyages with correct type structure", async () => {
            // Arrange
            const mockVoyageResponse = {
                id: 1,
                number: "47",
                startDate: new Date(),
                endDate: new Date(),
                soloProjectDeadline: new Date(),
                certificateIssueDate: new Date(),
                showcasePublishDate: null,
                sprints: [
                    // Array of sprints
                    {
                        id: 1,
                        number: 1,
                        startDate: new Date(),
                        endDate: new Date(),
                    },
                ],
            };
            jest.spyOn(
                sprintsService,
                "getVoyagesAndSprints",
            ).mockResolvedValue([mockVoyageResponse]);

            // Act
            const result = await sprintsController.getVoyagesAndSprints();

            // Assert
            expect(result).toEqual([mockVoyageResponse]);
            expect(Array.isArray(result[0].sprints)).toBe(true);
            expect(result[0].sprints[0]).toHaveProperty("id");
            expect(result[0].sprints[0]).toHaveProperty("number");
            expect(result[0].sprints[0]).toHaveProperty("startDate");
            expect(result[0].sprints[0]).toHaveProperty("endDate");
        });

        it("should return empty array when no voyages exist", async () => {
            // Arrange
            const spy = jest.spyOn(sprintsService, "getVoyagesAndSprints");
            spy.mockResolvedValue([]);

            // Act
            const result = await sprintsController.getVoyagesAndSprints();

            // Assert
            expect(result).toEqual([]);
        });
        it("should call getVoyagesAndSprints exactly once", async () => {
            // Act
            await sprintsController.getVoyagesAndSprints();

            // Assert
            expect(sprintsService.getVoyagesAndSprints).toHaveBeenCalledTimes(
                1,
            );
        });
    });

    describe("getSprintDatesByTeamId", () => {
        it("should have getSprintDatesByTeamId function defined", () => {
            expect(sprintsController.getSprintDatesByTeamId).toBeDefined();
        });

        it("should have sprintService.getSprintDatesByTeamId defined", () => {
            expect(sprintsService.getSprintDatesByTeamId).toBeDefined();
        });

        it("should return voyage and sprint data for a team", async () => {
            const result = {
                sprints: [
                    {
                        teamMeetings: [1, 2],
                        number: 1,
                        id: 1,
                        startDate: new Date(),
                        endDate: new Date(),
                    },
                ],
            };

            jest.spyOn(
                sprintsService,
                "getSprintDatesByTeamId",
            ).mockResolvedValue(result);

            expect(
                await sprintsController.getSprintDatesByTeamId({} as any, 1),
            ).toBe(result);
        });
    });

    describe("getMeetingById", () => {
        const mockMeeting = createMockData.meeting(1, {
            sprint: createMockData.sprint(1, 1),
            agendas: [
                createMockData.agenda(1, {
                    title: "Agenda 1",
                    description: "Agenda 1 description",
                    status: true,
                }),
            ],
            formResponseMeeting: [
                createMockData.formResponse(1, {
                    form: {
                        id: 1,
                        title: "Form 1",
                        description: null,
                        formTypeId: 1,
                        createdAt: mockDate,
                        updatedAt: mockDate,
                    },
                    responseGroup: {
                        id: 1,
                        createdAt: mockDate,
                        updatedAt: mockDate,
                        responses: [
                            {
                                id: 1,
                                questionId: 1,
                                responseGroupId: 1,
                                text: "Answer 1",
                                numeric: null,
                                boolean: null,
                                optionChoiceId: null,
                                createdAt: mockDate,
                                updatedAt: mockDate,
                                question: {
                                    id: 1,
                                    text: "Question 1",
                                    description: "Question 1 description",
                                    answerRequired: true,
                                    formId: 1,
                                    order: 0,
                                    inputTypeId: 0,
                                    multipleAllowed: null,
                                    optionGroupId: null,
                                    parentQuestionId: null,
                                    createdAt: mockDate,
                                    updatedAt: mockDate,
                                },
                                optionChoice: null,
                            },
                        ],
                    },
                }),
            ],
        });
        it("should have getMeetingById function defined", () => {
            expect(sprintsController.getMeetingById).toBeDefined();
        });
        it("should have sprintService.getMeetingById defined", () => {
            expect(sprintsService.getMeetingById).toBeDefined();
        });

        it("should return meeting details successfully", async () => {
            jest.spyOn(sprintsService, "getMeetingById").mockResolvedValue(
                mockMeeting,
            );
            const meetingId = 1;
            const result = await sprintsController.getMeetingById(
                mockRequest,
                meetingId,
            );

            expect(result).toEqual(mockMeeting);
            expect(sprintsService.getMeetingById).toHaveBeenCalledWith(
                meetingId,
                mockRequest,
            );
        });

        it("should verify the meeting response structure", async () => {
            // Arrange
            jest.spyOn(sprintsService, "getMeetingById").mockResolvedValue(
                mockMeeting,
            );
            const meetingId = 1;

            // Act
            const result = await sprintsController.getMeetingById(
                mockRequest,
                meetingId,
            );

            // Assert
            expect(result).toHaveProperty("id");
            expect(result).toHaveProperty("voyageTeamId");
            expect(result).toHaveProperty("sprint");
            expect(result).toHaveProperty("title");
            expect(result).toHaveProperty("description");
            expect(result).toHaveProperty("dateTime");
            expect(result).toHaveProperty("meetingLink");
            expect(result).toHaveProperty("notes");
            expect(result).toHaveProperty("agendas");
            expect(result).toHaveProperty("formResponseMeeting");

            // Verify nested properties for sprint
            expect(result.sprint).toHaveProperty("id");
            expect(result.sprint).toHaveProperty("number");
            expect(result.sprint).toHaveProperty("startDate");
            expect(result.sprint).toHaveProperty("endDate");
            expect(result.sprint.startDate).toBeInstanceOf(Date);
            expect(result.sprint.endDate).toBeInstanceOf(Date);

            // Verify nested properties for agendas
            if (result.agendas.length > 0) {
                expect(result.agendas[0]).toHaveProperty("id");
                expect(result.agendas[0]).toHaveProperty("title");
                expect(result.agendas[0]).toHaveProperty("description");
                expect(result.agendas[0]).toHaveProperty("status");
                expect(result.agendas[0]).toHaveProperty("updatedAt");
                expect(result.agendas[0].updatedAt).toBeInstanceOf(Date);
            }
            // Verify nested properties for form Response
            if (result.formResponseMeeting.length > 0) {
                const formResponse = result.formResponseMeeting[0];
                expect(formResponse).toHaveProperty("id");
                expect(formResponse.form).toHaveProperty("title");
                expect(
                    formResponse.responseGroup?.responses[0].question,
                ).toHaveProperty("text");
            }
        });
        it("should return meeting with empty agendas", async () => {
            // Arrange
            const meetingWithoutAgendas = { ...mockMeeting, agendas: [] };
            jest.spyOn(sprintsService, "getMeetingById").mockResolvedValue(
                meetingWithoutAgendas,
            );

            // Act
            const result = await sprintsController.getMeetingById(
                mockRequest,
                1,
            );

            // Assert
            expect(result.agendas).toEqual([]);
            expect(sprintsService.getMeetingById).toHaveBeenCalledWith(
                1,
                mockRequest,
            );
        });

        it("should return meeting with empty form responses", async () => {
            // Arrange
            const meetingWithoutForms = {
                ...mockMeeting,
                formResponseMeeting: [],
            };
            jest.spyOn(sprintsService, "getMeetingById").mockResolvedValue(
                meetingWithoutForms,
            );

            // Act
            const result = await sprintsController.getMeetingById(
                mockRequest,
                1,
            );

            // Assert
            expect(result.formResponseMeeting).toEqual([]);
            expect(sprintsService.getMeetingById).toHaveBeenCalledWith(
                1,
                mockRequest,
            );
        });
    });

    describe("createTeamMeeting", () => {
        const teamId = 1;
        const sprintNumber = 1;
        it("should have createTeamMeeting function defined", () => {
            expect(sprintsController.createTeamMeeting).toBeDefined();
        });
        it("should have sprintService.createTeamMeeting defined", () => {
            expect(sprintsService.createTeamMeeting).toBeDefined();
        });
        it("should create a team meeting successfully", async () => {
            // Arrange
            jest.spyOn(sprintsService, "createTeamMeeting").mockResolvedValue(
                mockCreatedMeeting,
            );
            // Act
            const result = await sprintsController.createTeamMeeting(
                createMockData.request,
                teamId,
                sprintNumber,
                mockCreateMeetingDto,
            );

            // Assert
            expect(result).toEqual(mockCreatedMeeting);
            expect(sprintsService.createTeamMeeting).toHaveBeenCalledWith(
                teamId,
                sprintNumber,
                mockCreateMeetingDto,
                mockRequest,
            );
        });

        it("should verify created meeting data structure", async () => {
            // Arrange
            jest.spyOn(sprintsService, "createTeamMeeting").mockResolvedValue(
                mockCreatedMeeting,
            );

            // Act
            const result = await sprintsController.createTeamMeeting(
                mockRequest,
                sprintNumber,
                teamId,
                mockCreateMeetingDto,
            );

            // Assert
            expect(result).toHaveProperty("id");
            expect(result).toHaveProperty("sprintId");
            expect(result).toHaveProperty("voyageTeamId");
            expect(result).toHaveProperty("title");
            expect(result).toHaveProperty("description");
            expect(result).toHaveProperty("meetingLink");
            expect(result).toHaveProperty("dateTime");
            expect(result).toHaveProperty("notes");
            expect(result.dateTime).toBeInstanceOf(Date);
        });

        it("should handle optional fields in creation dto", async () => {
            // Arrange
            const dtoWithOptionalFields = {
                title: "Required Title",
                dateTime: new Date(),
                meetingLink: "https://meet.test.com",
            } as unknown as CreateTeamMeetingDto;

            const meetingWithOptionalFields = {
                id: 1,
                sprintId: 1,
                voyageTeamId: 1,
                ...dtoWithOptionalFields,
                description: null,
                notes: null,
                createdAt: mockDate,
                updatedAt: mockDate,
            };

            jest.spyOn(sprintsService, "createTeamMeeting").mockResolvedValue(
                meetingWithOptionalFields,
            );

            // Act
            const result = await sprintsController.createTeamMeeting(
                mockRequest,
                sprintNumber,
                teamId,
                dtoWithOptionalFields,
            );

            // Assert
            expect(result.description).toBeNull();
            expect(result.notes).toBeNull();
            expect(sprintsService.createTeamMeeting).toHaveBeenCalledWith(
                teamId,
                sprintNumber,
                dtoWithOptionalFields,
                createMockData.request,
            );
        });
    });

    describe("updateTeamMeeting", () => {
        const meetingId = 1;
        it("should have updateTeamMeeting function defined", () => {
            expect(sprintsController.updateTeamMeeting).toBeDefined();
        });
        it("should have sprintService.updateTeamMeeting defined", () => {
            expect(sprintsService.updateTeamMeeting).toBeDefined();
        });
        it("should update a team meeting successfully", async () => {
            // Arrange
            jest.spyOn(sprintsService, "updateTeamMeeting").mockResolvedValue(
                mockUpdatedMeeting,
            );

            // Act
            const result = await sprintsController.updateTeamMeeting(
                mockRequest,
                meetingId,
                mockUpdatedMeetingDto,
            );

            // Assert
            expect(result).toEqual(mockUpdatedMeeting);
            expect(sprintsService.updateTeamMeeting).toHaveBeenCalledWith(
                meetingId,
                mockUpdatedMeetingDto,
                mockRequest,
            );
        });

        it("should handle partial updates", async () => {
            // Arrange
            const partialUpdateDto: UpdateTeamMeetingDto = {
                title: "Only Update Title",
                dateTime: mockDate,
            };

            const partiallyUpdatedMeeting = {
                ...mockUpdatedMeeting,
                title: partialUpdateDto.title,
                dateTime: partialUpdateDto.dateTime,
            } as unknown as MeetingResponse & { voyageTeamId: number };

            jest.spyOn(sprintsService, "updateTeamMeeting").mockResolvedValue(
                partiallyUpdatedMeeting,
            );

            // Act
            const result = await sprintsController.updateTeamMeeting(
                mockRequest,
                meetingId,
                partialUpdateDto,
            );

            // Assert
            expect(result.title).toBe(partialUpdateDto.title);
            expect(result.dateTime).toEqual(partialUpdateDto.dateTime);
            expect(result.description).toBe(mockUpdatedMeeting.description); // Unchanged
            expect(result.notes).toBe(mockUpdatedMeeting.notes); // Unchanged
            expect(sprintsService.updateTeamMeeting).toHaveBeenCalledWith(
                meetingId,
                partialUpdateDto,
                mockRequest,
            );
        });

        it("should verify updated meeting data structure", async () => {
            // Arrange
            jest.spyOn(sprintsService, "updateTeamMeeting").mockResolvedValue(
                mockUpdatedMeeting,
            );

            // Act
            const result = await sprintsController.updateTeamMeeting(
                mockRequest,
                meetingId,
                mockUpdatedMeetingDto,
            );

            // Assert
            expect(result).toHaveProperty("id");
            expect(result).toHaveProperty("sprintId");
            expect(result).toHaveProperty("voyageTeamId");
            expect(result).toHaveProperty("title");
            expect(result).toHaveProperty("description");
            expect(result).toHaveProperty("meetingLink");
            expect(result).toHaveProperty("dateTime");
            expect(result).toHaveProperty("notes");
            expect(result.dateTime).toBeInstanceOf(Date);
        });
    });

    describe("addMeetingAgenda", () => {
        const meetingId = 1;
        it("should have addMeetingAgenda function defined", () => {
            expect(sprintsController.addMeetingAgenda).toBeDefined();
        });
        it("should have sprintService.addMeetingAgenda defined", () => {
            expect(sprintsService.createMeetingAgenda).toBeDefined();
        });
        it("should create an agenda item successfully", async () => {
            // Arrange
            jest.spyOn(sprintsService, "createMeetingAgenda").mockResolvedValue(
                mockCreatedAgenda,
            );

            // Act
            const result = await sprintsController.addMeetingAgenda(
                mockRequest,
                meetingId,
                mockCreateAgendaDto,
            );

            // Assert
            expect(result).toEqual(mockCreatedAgenda);
            expect(sprintsService.createMeetingAgenda).toHaveBeenCalledWith(
                meetingId,
                mockCreateAgendaDto,
                mockRequest,
            );
        });

        it("should verify created agenda data structure", async () => {
            // Arrange
            jest.spyOn(sprintsService, "createMeetingAgenda").mockResolvedValue(
                mockCreatedAgenda,
            );

            // Act
            const result = await sprintsController.addMeetingAgenda(
                mockRequest,
                meetingId,
                mockCreateAgendaDto,
            );

            // Assert
            expect(result).toHaveProperty("id");
            expect(result).toHaveProperty("teamMeetingId");
            expect(result).toHaveProperty("createdAt");
            expect(result).toHaveProperty("updatedAt");
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
        });

        it("should create agenda with minimal required fields", async () => {
            // Arrange

            const minimalAgendaDto = {
                title: "Minimal Agenda",
                description: "Agenda description",
            } as unknown as CreateAgendaDto;

            const minimalCreatedAgenda: AgendaResponse = {
                ...mockCreatedAgenda,
                title: minimalAgendaDto.title,
                description: "Agenda description",
            };

            jest.spyOn(sprintsService, "createMeetingAgenda").mockResolvedValue(
                minimalCreatedAgenda,
            );

            // Act
            const result = await sprintsController.addMeetingAgenda(
                mockRequest,
                meetingId,
                minimalAgendaDto,
            );

            // Assert
            expect(result.title).toBe(minimalAgendaDto.title);
            expect(result.description).toBe(minimalAgendaDto.description);
            expect(result.status).toBe(true);
            expect(sprintsService.createMeetingAgenda).toHaveBeenCalledWith(
                meetingId,
                minimalAgendaDto,
                mockRequest,
            );
        });
    });

    describe("updateMeetingAgenda", () => {
        const agendaId = 1;
        it("should have updateMeetingAgenda function defined", () => {
            expect(sprintsController.updateMeetingAgenda).toBeDefined();
        });
        it("should have sprintService.updateMeetingAgenda defined", () => {
            expect(sprintsService.updateMeetingAgenda).toBeDefined();
        });
        it("should update an agenda item successfully", async () => {
            // Arrange
            jest.spyOn(sprintsService, "updateMeetingAgenda").mockResolvedValue(
                mockUpdatedAgenda,
            );

            // Act
            const result = await sprintsController.updateMeetingAgenda(
                mockRequest,
                agendaId,
                mockUpdatedAgendaDto,
            );

            // Assert
            expect(result).toEqual(mockUpdatedAgenda);
            expect(sprintsService.updateMeetingAgenda).toHaveBeenCalledWith(
                agendaId,
                mockUpdatedAgendaDto,
                mockRequest,
            );
        });

        it("should handle partial updates", async () => {
            // Arrange
            const partialUpdateDto: UpdateAgendaDto = {
                status: true,
                // title and description omitted
            };

            const partiallyUpdatedAgenda: AgendaResponse = {
                ...mockUpdatedAgenda,
                title: "Original Title", // Unchanged
                description: "Original Description", // Unchanged
                status: true, // Updated
            };

            jest.spyOn(sprintsService, "updateMeetingAgenda").mockResolvedValue(
                partiallyUpdatedAgenda,
            );

            // Act
            const result = await sprintsController.updateMeetingAgenda(
                mockRequest,
                agendaId,
                partialUpdateDto,
            );

            // Assert
            expect(result.status).toBe(partialUpdateDto.status);
            expect(result.title).toBe("Original Title");
            expect(result.description).toBe("Original Description");
            expect(sprintsService.updateMeetingAgenda).toHaveBeenCalledWith(
                agendaId,
                partialUpdateDto,
                mockRequest,
            );
        });

        it("should update status to completed", async () => {
            // Arrange
            const statusUpdateDto: UpdateAgendaDto = {
                status: true,
            };

            const completedAgenda: AgendaResponse = {
                ...mockUpdatedAgenda,
                status: true,
            };

            jest.spyOn(sprintsService, "updateMeetingAgenda").mockResolvedValue(
                completedAgenda,
            );

            // Act
            const result = await sprintsController.updateMeetingAgenda(
                mockRequest,
                agendaId,
                statusUpdateDto,
            );

            // Assert
            expect(result.status).toBe(true);
            expect(sprintsService.updateMeetingAgenda).toHaveBeenCalledWith(
                agendaId,
                statusUpdateDto,
                mockRequest,
            );
        });

        it("should verify updated agenda data structure", async () => {
            // Arrange
            jest.spyOn(sprintsService, "updateMeetingAgenda").mockResolvedValue(
                mockUpdatedAgenda,
            );

            // Act
            const result = await sprintsController.updateMeetingAgenda(
                mockRequest,
                agendaId,
                mockUpdatedAgendaDto,
            );

            // Assert
            expect(result).toHaveProperty("id");
            expect(result).toHaveProperty("teamMeetingId");
            expect(result).toHaveProperty("title");
            expect(result).toHaveProperty("description");
            expect(result).toHaveProperty("status");
            expect(result).toHaveProperty("createdAt");
            expect(result).toHaveProperty("updatedAt");
            expect(result.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe("deleteMeetingAgenda", () => {
        const agendaId = 1;
        it("should have deleteMeetingAgenda function defined", () => {
            expect(sprintsController.deleteMeetingAgenda).toBeDefined();
        });
        it("should have sprintService.deleteMeetingAgenda defined", () => {
            expect(sprintsService.deleteMeetingAgenda).toBeDefined();
        });
        it("should delete an agenda item successfully", async () => {
            // Arrange
            jest.spyOn(sprintsService, "deleteMeetingAgenda").mockResolvedValue(
                mockDeletedAgenda,
            );

            // Act
            const result = await sprintsController.deleteMeetingAgenda(
                mockRequest,
                agendaId,
            );

            // Assert
            expect(result).toEqual(mockDeletedAgenda);
            expect(sprintsService.deleteMeetingAgenda).toHaveBeenCalledWith(
                agendaId,
                mockRequest,
            );
        });

        it("should verify deleted agenda data structure in response", async () => {
            // Arrange
            jest.spyOn(sprintsService, "deleteMeetingAgenda").mockResolvedValue(
                mockDeletedAgenda,
            );

            // Act
            const result = await sprintsController.deleteMeetingAgenda(
                mockRequest,
                agendaId,
            );

            // Assert
            expect(result).toHaveProperty("id");
            expect(result).toHaveProperty("teamMeetingId");
            expect(result).toHaveProperty("title");
            expect(result).toHaveProperty("description");
            expect(result).toHaveProperty("status");
            expect(result).toHaveProperty("createdAt");
            expect(result).toHaveProperty("updatedAt");
        });

        it("should accept numeric string as agendaId", async () => {
            // Arrange
            jest.spyOn(sprintsService, "deleteMeetingAgenda").mockResolvedValue(
                mockDeletedAgenda,
            );

            // Act
            const result = await sprintsController.deleteMeetingAgenda(
                mockRequest,
                1,
            );

            // Assert
            expect(result).toEqual(mockDeletedAgenda);
            expect(sprintsService.deleteMeetingAgenda).toHaveBeenCalledWith(
                1,
                mockRequest,
            );
        });

        it("should delete completed agenda items", async () => {
            // Arrange
            const completedAgenda = {
                ...mockDeletedAgenda,
                status: false,
            };
            jest.spyOn(sprintsService, "deleteMeetingAgenda").mockResolvedValue(
                completedAgenda,
            );

            // Act
            const result = await sprintsController.deleteMeetingAgenda(
                mockRequest,
                agendaId,
            );

            // Assert
            expect(result.status).toBe(false);
            expect(sprintsService.deleteMeetingAgenda).toHaveBeenCalledWith(
                agendaId,
                mockRequest,
            );
        });
    });
    describe("addMeetingFormResponse", () => {
        it("should have addMeetingFormResponse function defined", () => {
            expect(sprintsController.addMeetingFormResponse).toBeDefined();
        });

        it("should have sprintService.addMeetingFormResponse defined", () => {
            expect(sprintsService.addMeetingFormResponse).toBeDefined();
        });

        it("should call addMeetingFormResponse with correct parameters", async () => {
            // Arrange
            const meetingId = 1;
            const formId = 1;
            jest.spyOn(
                sprintsService,
                "addMeetingFormResponse",
            ).mockResolvedValue(mockFormResponseMeeting);

            // Act
            await sprintsController.addMeetingFormResponse(
                mockRequest,
                meetingId,
                formId,
            );

            // Assert
            expect(sprintsService.addMeetingFormResponse).toHaveBeenCalledWith(
                meetingId,
                formId,
                mockRequest,
            );
        });

        it("should verify service method is called exactly once", async () => {
            // Arrange
            const meetingId = 1;
            const formId = 1;
            jest.spyOn(
                sprintsService,
                "addMeetingFormResponse",
            ).mockResolvedValue(mockFormResponseMeeting);

            // Act
            await sprintsController.addMeetingFormResponse(
                mockRequest,
                meetingId,
                formId,
            );

            // Assert
            expect(sprintsService.addMeetingFormResponse).toHaveBeenCalledTimes(
                1,
            );
        });

        it("should verify service method is called with numeric parameters", async () => {
            // Arrange
            const meetingId = 1;
            const formId = 1;
            const spy = jest
                .spyOn(sprintsService, "addMeetingFormResponse")
                .mockResolvedValue(mockFormResponseMeeting);

            // Act
            await sprintsController.addMeetingFormResponse(
                mockRequest,
                meetingId,
                formId,
            );

            // Assert
            const [calledMeetingId, calledFormId] = spy.mock.calls[0];
            expect(typeof calledMeetingId).toBe("number");
            expect(typeof calledFormId).toBe("number");
        });
    });
    describe("getMeetingFormQuestionsWithResponses", () => {
        it("should have getMeetingFormQuestionsWithResponses function defined", () => {
            expect(
                sprintsController.getMeetingFormQuestionsWithResponses,
            ).toBeDefined();
        });

        it("should have sprintService.getMeetingFormQuestionsWithResponses defined", () => {
            expect(
                sprintsService.getMeetingFormQuestionsWithResponses,
            ).toBeDefined();
        });

        it("should call sprintsService.getMeetingFormQuestionsWithResponses with correct parameters", async () => {
            // Arrange
            const meetingId = 1;
            const formId = 1;
            const mockFullFormResponse = createMockData.formWithQuestions(
                1,
                mockFormResponseMeeting,
            );
            jest.spyOn(
                sprintsService,
                "getMeetingFormQuestionsWithResponses",
            ).mockResolvedValue(mockFullFormResponse);

            // Act
            await sprintsController.getMeetingFormQuestionsWithResponses(
                meetingId,
                formId,
                mockRequest,
            );

            // Assert
            expect(
                sprintsService.getMeetingFormQuestionsWithResponses,
            ).toHaveBeenCalledWith(meetingId, formId, mockRequest);
        });

        it("should verify service method is called exactly once", async () => {
            // Arrange
            const meetingId = 1;
            const formId = 1;

            jest.spyOn(
                sprintsService,
                "getMeetingFormQuestionsWithResponses",
            ).mockResolvedValue(mockFormWithQuestionsResponse);

            // Act
            await sprintsController.getMeetingFormQuestionsWithResponses(
                meetingId,
                formId,
                mockRequest,
            );

            // Assert
            expect(
                sprintsService.getMeetingFormQuestionsWithResponses,
            ).toHaveBeenCalledTimes(1);
        });

        it("should verify service method is called with numeric parameters", async () => {
            // Arrange
            const meetingId = 1;
            const formId = 1;
            const spy = jest
                .spyOn(sprintsService, "getMeetingFormQuestionsWithResponses")
                .mockResolvedValue(mockFormWithQuestionsResponse);

            // Act
            await sprintsController.getMeetingFormQuestionsWithResponses(
                meetingId,
                formId,
                mockRequest,
            );

            // Assert
            const [calledMeetingId, calledFormId] = spy.mock.calls[0];
            expect(typeof calledMeetingId).toBe("number");
            expect(typeof calledFormId).toBe("number");
        });

        it("should verify parameters are passed in correct order", async () => {
            // Arrange
            const meetingId = 1;
            const formId = 2;
            const spy = jest
                .spyOn(sprintsService, "getMeetingFormQuestionsWithResponses")
                .mockResolvedValue(mockFormWithQuestionsResponse);

            // Act
            await sprintsController.getMeetingFormQuestionsWithResponses(
                meetingId,
                formId,
                mockRequest,
            );

            // Assert
            const [firstParam, secondParam, thirdParam] = spy.mock.calls[0];
            expect(firstParam).toBe(meetingId);
            expect(secondParam).toBe(formId);
            expect(thirdParam).toBe(mockRequest);
        });

        it("should verify service method handles different meetingIds", async () => {
            // Arrange
            const meetingIds = [1, 2, 3];
            const formId = 1;
            const spy = jest
                .spyOn(sprintsService, "getMeetingFormQuestionsWithResponses")
                .mockResolvedValue(mockFormWithQuestionsResponse);

            // Act & Assert
            for (const meetingId of meetingIds) {
                await sprintsController.getMeetingFormQuestionsWithResponses(
                    meetingId,
                    formId,
                    mockRequest,
                );
                expect(spy).toHaveBeenCalledWith(
                    meetingId,
                    formId,
                    mockRequest,
                );
            }
        });
    });
    describe("updateMeetingFormResponse", () => {
        const meetingId = 1;
        const formId = 1;

        it("should have updateMeetingFormResponse function defined", () => {
            expect(sprintsController.updateMeetingFormResponse).toBeDefined();
        });

        it("should have sprintService.updateMeetingFormResponse defined", () => {
            expect(sprintsService.updateMeetingFormResponse).toBeDefined();
        });

        it("should call sprintsService.updateMeetingFormResponse with correct parameters", async () => {
            // Arrange
            jest.spyOn(
                sprintsService,
                "updateMeetingFormResponse",
            ).mockResolvedValue([mockUpdateMeetingFormResponse]);

            // Act
            await sprintsController.updateMeetingFormResponse(
                mockRequest,
                meetingId,
                formId,
                mockUpdateMeetingFormResponseDto,
            );

            // Assert
            expect(
                sprintsService.updateMeetingFormResponse,
            ).toHaveBeenCalledWith(
                meetingId,
                formId,
                mockUpdateMeetingFormResponseDto,
                mockRequest,
            );
        });

        it("should verify service method is called exactly once", async () => {
            // Arrange
            jest.spyOn(
                sprintsService,
                "updateMeetingFormResponse",
            ).mockResolvedValue([mockUpdateMeetingFormResponse]);

            // Act
            await sprintsController.updateMeetingFormResponse(
                mockRequest,
                meetingId,
                formId,
                mockUpdateMeetingFormResponseDto,
            );

            // Assert
            expect(
                sprintsService.updateMeetingFormResponse,
            ).toHaveBeenCalledTimes(1);
        });

        it("should verify service method is called with numeric meetingId and formId", async () => {
            // Arrange
            const spy = jest
                .spyOn(sprintsService, "updateMeetingFormResponse")
                .mockResolvedValue([mockUpdateMeetingFormResponse]);

            // Act
            await sprintsController.updateMeetingFormResponse(
                mockRequest,
                meetingId,
                formId,
                mockUpdateMeetingFormResponseDto,
            );

            // Assert
            const [calledMeetingId, calledFormId] = spy.mock.calls[0];
            expect(typeof calledMeetingId).toBe("number");
            expect(typeof calledFormId).toBe("number");
        });

        it("should verify parameters are passed in correct order", async () => {
            // Arrange
            const spy = jest
                .spyOn(sprintsService, "updateMeetingFormResponse")
                .mockResolvedValue([mockUpdateMeetingFormResponse]);

            // Act
            await sprintsController.updateMeetingFormResponse(
                mockRequest,
                meetingId,
                formId,
                mockUpdateMeetingFormResponseDto,
            );

            // Assert
            const [firstParam, secondParam, thirdParam, fourthParam] =
                spy.mock.calls[0];
            expect(firstParam).toBe(meetingId);
            expect(secondParam).toBe(formId);
            expect(thirdParam).toEqual(mockUpdateMeetingFormResponseDto);
            expect(fourthParam).toBe(mockRequest);
        });

        it("should verify DTO is passed unmodified to service", async () => {
            // Arrange
            const spy = jest
                .spyOn(sprintsService, "updateMeetingFormResponse")
                .mockResolvedValue([mockUpdateMeetingFormResponse]);

            // Act
            await sprintsController.updateMeetingFormResponse(
                mockRequest,
                meetingId,
                formId,
                mockUpdateMeetingFormResponseDto,
            );

            // Assert
            const passedDto = spy.mock.calls[0][2];

            expect(passedDto).toEqual(mockUpdateMeetingFormResponseDto);
            expect(passedDto.responses?.[0].questionId).toBe(
                mockUpdateMeetingFormResponseDto.responses?.[0].questionId,
            );
            expect(passedDto.responses?.[0].text).toBe(
                mockUpdateMeetingFormResponseDto.responses?.[0].text,
            );
            expect(passedDto.responses?.[0].numeric).toBe(
                mockUpdateMeetingFormResponseDto.responses?.[0].numeric,
            );
            expect(passedDto.responses?.[0].boolean).toBe(
                mockUpdateMeetingFormResponseDto.responses?.[0].boolean,
            );
            expect(passedDto.responses?.[0].optionChoiceId).toBe(
                mockUpdateMeetingFormResponseDto.responses?.[0].optionChoiceId,
            );
        });
    });
    describe("addCheckinFormResponse", () => {
        it("should have addCheckinFormResponse function defined", () => {
            expect(sprintsController.addCheckinFormResponse).toBeDefined();
        });

        it("should have sprintService.addCheckinFormResponse defined", () => {
            expect(sprintsService.addCheckinFormResponse).toBeDefined();
        });

        it("should call sprintsService.addCheckinFormResponse with correct parameters", async () => {
            // Arrange
            const mockCheckinResponse: CheckinSubmissionResponse = {
                id: 1,
                voyageTeamMemberId: mockCreateCheckinFormDto.voyageTeamMemberId,
                sprintId: mockCreateCheckinFormDto.sprintId,
                responseGroupId: 5,
                createdAt: mockDate,
            };
            jest.spyOn(
                sprintsService,
                "addCheckinFormResponse",
            ).mockResolvedValue(mockCheckinResponse);

            // Act
            await sprintsController.addCheckinFormResponse(
                mockCreateCheckinFormDto,
            );

            // Assert
            expect(sprintsService.addCheckinFormResponse).toHaveBeenCalledWith(
                mockCreateCheckinFormDto,
            );
        });

        it("should verify service method is called exactly once", async () => {
            // Arrange
            jest.spyOn(
                sprintsService,
                "addCheckinFormResponse",
            ).mockResolvedValue({
                id: 1,
                voyageTeamMemberId: 1,
                sprintId: 1,
                responseGroupId: 5,
                createdAt: mockDate,
            });

            // Act
            await sprintsController.addCheckinFormResponse(
                mockCreateCheckinFormDto,
            );

            // Assert
            expect(sprintsService.addCheckinFormResponse).toHaveBeenCalledTimes(
                1,
            );
        });

        it("should verify DTO is passed unmodified to service", async () => {
            // Arrange
            const spy = jest
                .spyOn(sprintsService, "addCheckinFormResponse")
                .mockResolvedValue({
                    id: 1,
                    voyageTeamMemberId: 1,
                    sprintId: 1,
                    responseGroupId: 5,
                    createdAt: mockDate,
                });

            // Act
            await sprintsController.addCheckinFormResponse(
                mockCreateCheckinFormDto,
            );

            // Assert
            const passedDto = spy.mock.calls[0][0];
            expect(passedDto).toEqual(mockCreateCheckinFormDto);
            expect(passedDto.sprintId).toBe(mockCreateCheckinFormDto.sprintId);
            expect(passedDto.voyageTeamMemberId).toBe(
                mockCreateCheckinFormDto.voyageTeamMemberId,
            );
            expect(passedDto.responses).toEqual(
                mockCreateCheckinFormDto.responses,
            );
        });
    });
    describe("getCheckinFormResponse", () => {
        const mockQuery: CheckinQueryDto = {
            teamId: 1,
            sprintNumber: 1,
            voyageNumber: "46",
            userId: "test-user-id",
        };

        it("should have getCheckinFormResponse function defined", () => {
            expect(sprintsController.getCheckinFormResponse).toBeDefined();
        });

        it("should have sprintService.getCheckinFormResponse defined", () => {
            expect(sprintsService.getCheckinFormResponse).toBeDefined();
        });

        it("should call sprintsService.getCheckinFormResponse with correct parameters", async () => {
            // Arrange
            const mockResponse: CheckinFormResponse = {
                id: 1,
                voyageTeamMemberId: 1,
                sprintId: 1,
                adminComments: "Great job!",
                feedbackSent: true,
                createdAt: mockDate,
                updatedAt: mockDate,
                voyageTeamMember: {
                    voyageTeamId: 4,
                },
                sprint: {
                    number: 1,
                    voyage: {
                        number: 46,
                    },
                },
                responseGroup: {
                    responses: [],
                },
            };

            jest.spyOn(
                sprintsService,
                "getCheckinFormResponse",
            ).mockResolvedValue([mockResponse]);

            // Act
            await sprintsController.getCheckinFormResponse(mockQuery);

            // Assert
            expect(sprintsService.getCheckinFormResponse).toHaveBeenCalledWith(
                mockQuery,
            );
        });

        it("should verify service method is called exactly once", async () => {
            // Arrange
            jest.spyOn(
                sprintsService,
                "getCheckinFormResponse",
            ).mockResolvedValue([]);

            // Act
            await sprintsController.getCheckinFormResponse(mockQuery);

            // Assert
            expect(sprintsService.getCheckinFormResponse).toHaveBeenCalledTimes(
                1,
            );
        });

        it("should handle empty query parameters", async () => {
            // Arrange
            const emptyQuery = {} as CheckinQueryDto;
            jest.spyOn(
                sprintsService,
                "getCheckinFormResponse",
            ).mockResolvedValue([]);

            // Act
            await sprintsController.getCheckinFormResponse(emptyQuery);

            // Assert
            expect(sprintsService.getCheckinFormResponse).toHaveBeenCalledWith(
                emptyQuery,
            );
        });

        it("should handle partial query parameters", async () => {
            // Arrange
            const partialQuery: CheckinQueryDto = {
                teamId: 1,
                sprintNumber: 1,
            };
            jest.spyOn(
                sprintsService,
                "getCheckinFormResponse",
            ).mockResolvedValue([]);

            // Act
            await sprintsController.getCheckinFormResponse(partialQuery);

            // Assert
            expect(sprintsService.getCheckinFormResponse).toHaveBeenCalledWith(
                partialQuery,
            );
        });
    });
    // Add more tests for other methods similarly...
});
