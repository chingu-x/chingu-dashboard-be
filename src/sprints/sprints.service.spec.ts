import { SprintsService } from "./sprints.service";
import { createMockData, helpers, mockDate } from "../global/mocks/mock-data";
import { prismaMock } from "@/prisma/singleton";
import {
    VoyageTeam,
    Form,
    TeamMeeting,
    FormResponseMeeting,
    FormResponseCheckin,
    Response,
    Agenda,
} from "@prisma/client";
import { GlobalService } from "@/global/global.service";
import { FormsService } from "@/forms/forms.service";

import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateAgendaDto } from "./dto/create-agenda.dto";
import { UpdateAgendaDto } from "./dto/update-agenda.dto";
import { CheckinQueryDto } from "./dto/get-checkin-form-response";
import { manageOwnTeamMeetingOrAgendaById } from "@/ability/conditions/meetingOrAgenda.ability";
import { FormTitles } from "@/global/constants/formTitles";
import { CustomRequest } from "@/global/types/CustomRequest";
import {
    toBeArray,
    toHaveBeenCalledOnce,
    toBeTrue,
    toBeFalse,
} from "jest-extended";

expect.extend({ toBeArray, toHaveBeenCalledOnce, toBeTrue, toBeFalse });

jest.mock("@/ability/conditions/meetingOrAgenda.ability", () => ({
    manageOwnTeamMeetingOrAgendaById: jest.fn(),
}));

describe("SprintsService", () => {
    let service: SprintsService;
    let formService: FormsService;
    let globalService: GlobalService;

    beforeEach(async () => {
        const testModule = await helpers.createTestModule();
        service = testModule.service;
        formService = testModule.formService;
        globalService = testModule.globalService;
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(formService).toBeDefined();
        expect(globalService).toBeDefined();
    });

    describe("isMeetingForm", () => {
        it("should return true for valid meeting form", async () => {
            const formId = 1;
            prismaMock.form.findUnique.mockResolvedValue({
                id: formId,
                formType: {
                    name: "meeting",
                },
            } as any);
            const result = await (service as any)["isMeetingForm"](formId);
            expect(result).toBeTrue();
            expect(prismaMock.form.findUnique).toHaveBeenCalledWith({
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
        });
        it("should throw BadRequestException when form is not a meeting form", async () => {
            const formId = 99;
            prismaMock.form.findUnique.mockResolvedValue({
                id: formId,
                formType: {
                    name: "not_meeting",
                },
            } as any);

            await expect(
                (service as any)["isMeetingForm"](formId),
            ).rejects.toThrow(
                new BadRequestException(
                    `Form (id: ${formId}) is not a meeting form.`,
                ),
            );
        });
    });
    describe("findSprintIdBySprintNumber", () => {
        it("should be defined", () => {
            expect(service.findSprintIdBySprintNumber).toBeDefined();
        });
        it("should return a sprint id for a valid team and sprint number", async () => {
            const teamId = 1;
            const sprintNumber = 2;
            const expectedSprintId = 42;
            const mockSprints = [
                createMockData.sprint(41, 1),
                createMockData.sprint(expectedSprintId, sprintNumber),
                createMockData.sprint(43, 3),
            ];
            prismaMock.voyageTeam.findUnique.mockResolvedValue({
                voyage: {
                    sprints: mockSprints,
                },
            } as any);
            const result = await service.findSprintIdBySprintNumber(
                teamId,
                sprintNumber,
            );
            expect(result).toBe(expectedSprintId);
        });
        it("should return undefined when sprint number not found", async () => {
            const teamId = 1;
            const sprintNumber = 999;

            prismaMock.voyageTeam.findUnique.mockResolvedValue({
                voyage: {
                    sprints: [
                        { id: 41, number: 1 },
                        { id: 42, number: 2 },
                    ],
                },
            } as any);

            const result = await service.findSprintIdBySprintNumber(
                teamId,
                sprintNumber,
            );
            expect(result).toBeUndefined();
        });
    });
    describe("getVoyagesAndSprints", () => {
        it("should be defined", () => {
            expect(service.getVoyagesAndSprints).toBeDefined();
        });
        it("should return an array of voyages and sprints", async () => {
            const mockVoyagesAndSprintsResponse =
                helpers.createVoyageWithSprints();
            prismaMock.voyage.findMany.mockResolvedValue(
                mockVoyagesAndSprintsResponse,
            );

            const result = await service.getVoyagesAndSprints();

            expect(result).toBeArray();
            expect(result[0].sprints).toBeArray();
            expect(result).toEqual(mockVoyagesAndSprintsResponse);
            expect(prismaMock.voyage.findMany).toHaveBeenCalledWith({
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
        });
    });
    describe("buildQuery", () => {
        it("should be defined", () => {
            expect((service as any).buildQuery).toBeDefined();
        });
        it("should build correct query with sprintNumber and startDate", async () => {
            jest.spyOn(globalService, "validateOrGetDbItem").mockResolvedValue(
                true,
            );

            const result = await (service as any).buildQuery({ teamId: 1 });

            expect(result).toEqual({
                voyageTeamMember: {
                    voyageTeamId: 1,
                },
            });
        });

        it("should combine multiple query parameters", async () => {
            jest.spyOn(globalService, "validateOrGetDbItem").mockResolvedValue(
                true,
            );

            const query = {
                teamId: 1,
                sprintNumber: 2,
                voyageNumber: createMockData.voyage().number,
            };

            const result = await (service as any).buildQuery(query);

            expect(result).toEqual({
                sprint: {
                    number: 2,
                    voyage: { number: query.voyageNumber },
                },
                voyageTeamMember: {
                    voyageTeamId: 1,
                },
            });
        });
    });
    describe("getSprintDatesByTeamId", () => {
        it("should be defined", () => {
            expect(service.getSprintDatesByTeamId).toBeDefined();
        });
        it("should transform sprints data correctly", async () => {
            const mockSprint1 = createMockData.sprint(1, 1);
            const mockSprint2 = createMockData.sprint(2, 2);
            const mockTeamData = {
                id: 1,
                name: "Test Team",
                endDate: mockDate,
                teamMeetings: [
                    { id: 1, sprintId: mockSprint1.id },
                    { id: 2, sprintId: mockSprint1.id },
                    { id: 3, sprintId: mockSprint2.id },
                ],
                voyage: {
                    ...createMockData.voyage(),
                    sprints: [mockSprint1, mockSprint2],
                },
            };

            prismaMock.voyageTeam.findUnique.mockResolvedValue(
                mockTeamData as unknown as VoyageTeam,
            );

            const result = await service.getSprintDatesByTeamId(
                1,
                createMockData.request,
            );

            expect(result.sprints).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        ...mockSprint1,
                        teamMeetings: expect.arrayContaining([1, 2]),
                    }),
                    expect.objectContaining({
                        ...mockSprint2,
                        teamMeetings: expect.arrayContaining([3]),
                    }),
                ]),
            );
        });
    });
    describe("getMeetingById", () => {
        it("should be defined", () => {
            expect(service.getMeetingById).toBeDefined();
        });
        it("should return meeting with all related data for a valid id", async () => {
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
                            parseConfig: null,
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
                                        parseConfig: null,
                                    },
                                    optionChoice: null,
                                },
                            ],
                        },
                    }),
                ],
            });

            prismaMock.teamMeeting.findUnique.mockResolvedValue(
                mockMeeting as unknown as TeamMeeting,
            );

            const result = await service.getMeetingById(
                1,
                createMockData.request,
            );

            expect(result).toEqual(mockMeeting);
        });
    });
    describe("addMeetingFormResponse", () => {
        it("should be defined", () => {
            expect(service.addMeetingFormResponse).toBeDefined();
        });

        it("should create form response with response group", async () => {
            const meetingId = 1;
            const formId = 1;

            // Mock meeting existence check
            prismaMock.teamMeeting.findUnique.mockResolvedValue({
                id: meetingId,
                voyageTeamId: 1,
            } as TeamMeeting);

            // Mock form type check
            prismaMock.form.findUnique.mockResolvedValue({
                id: formId,
                formType: {
                    name: "meeting",
                },
            } as unknown as Form);

            // Mock create form response
            const mockFormResponse = createMockData.formResponse(1, {
                formId,
                meetingId,
            });

            prismaMock.formResponseMeeting.create.mockResolvedValue(
                mockFormResponse as unknown as FormResponseMeeting,
            );

            // Mock update with response group
            const mockUpdatedResponse = {
                ...mockFormResponse,
                responseGroup: {
                    id: 1,
                },
            };

            prismaMock.formResponseMeeting.update.mockResolvedValue(
                mockUpdatedResponse as unknown as FormResponseMeeting,
            );

            const result = await service.addMeetingFormResponse(
                formId,
                meetingId,
                createMockData.request,
            );

            expect(result).toEqual(mockUpdatedResponse);
            expect(prismaMock.formResponseMeeting.create).toHaveBeenCalledWith({
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
            expect(prismaMock.formResponseMeeting.update).toHaveBeenCalledWith({
                where: {
                    id: mockFormResponse.id,
                },
                data: {
                    responseGroup: {
                        create: {},
                    },
                },
            });
        });
    });
    describe("executeQuery", () => {
        it("should be defined", () => {
            expect((service as any).executeQuery).toBeDefined();
        });
        it("should execute query and return result", async () => {
            const mockQuery = {
                sprint: {
                    number: 1,
                },
            };
            const mockResult = [
                {
                    id: 1,
                    voyageTeamMember: {
                        voyageTeamId: createMockData.voyage().id,
                    },
                    sprint: {
                        number: createMockData.sprint(1, 1).number,
                        voyage: {
                            number: createMockData.voyage().number,
                        },
                    },
                    responseGroup: {
                        responses: [],
                    },
                },
            ];

            prismaMock.formResponseCheckin.findMany.mockResolvedValue(
                mockResult as unknown as FormResponseCheckin[],
            );

            const result = await (service as any).executeQuery(mockQuery);

            expect(result).toEqual(mockResult);
            expect(
                prismaMock.formResponseCheckin.findMany,
            ).toHaveBeenCalledWith({
                where: mockQuery,
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
        });
    });
    describe("createTeamMeeting", () => {
        it("should be defined", () => {
            expect(service.createTeamMeeting).toBeDefined();
        });
        it("should create a team meeting", async () => {
            const teamId = 1;
            const sprintNumber = 1;
            const sprintId = 1;
            const mockDto = createMockData.createTeamMeetingDto();

            const findSprintSpy = jest.spyOn(
                service,
                "findSprintIdBySprintNumber",
            );
            findSprintSpy.mockResolvedValue(sprintId);

            //Mock check for existing meeting
            prismaMock.teamMeeting.findFirst.mockResolvedValue(null);

            // Mock create team meeting
            const mockCreatedMeeting = createMockData.meeting(1, {
                sprintId,
                voyageTeamId: teamId,
                description: mockDto.description,
                meetingLink: mockDto.meetingLink,
                dateTime: mockDto.dateTime,
                notes: mockDto.notes,
            });

            prismaMock.teamMeeting.create.mockResolvedValue(
                mockCreatedMeeting as any,
            );

            const result = await service.createTeamMeeting(
                teamId,
                sprintNumber,
                mockDto,
                createMockData.request,
            );

            expect(findSprintSpy).toHaveBeenCalledWith(teamId, sprintNumber);
            expect(result).toEqual(mockCreatedMeeting);
            expect(prismaMock.teamMeeting.create).toHaveBeenCalledWith({
                data: {
                    sprintId,
                    voyageTeamId: teamId,
                    ...mockDto,
                },
            });
        });
        it("should check existing meeting before creating a new one", async () => {
            const teamId = 1;
            const sprintNumber = 1;
            const sprintId = 1;
            const mockDto = createMockData.createTeamMeetingDto();

            const findSprintSpy = jest.spyOn(
                service,
                "findSprintIdBySprintNumber",
            );
            findSprintSpy.mockResolvedValue(sprintId);

            //Mock check for existing meeting
            prismaMock.teamMeeting.findFirst.mockResolvedValue({
                id: 1,
                sprintId,
                title: "Existing meeting",
            } as TeamMeeting);

            await expect(
                service.createTeamMeeting(
                    teamId,
                    sprintNumber,
                    mockDto,
                    createMockData.request,
                ),
            ).rejects.toThrowError("A meeting already exist for this sprint.");

            expect(prismaMock.teamMeeting.create).not.toHaveBeenCalled();
        });

        it("should create meeting with all provided fields", async () => {
            const teamId = 1;
            const sprintNumber = 1;
            const sprintId = 1;
            const mockDto = createMockData.createTeamMeetingDto();
            const findSprintSpy = jest.spyOn(
                service,
                "findSprintIdBySprintNumber",
            );
            findSprintSpy.mockResolvedValue(sprintId);

            prismaMock.teamMeeting.findFirst.mockResolvedValue(null);

            const expectedMeeting = {
                id: 1,
                sprintId,
                voyageTeamId: teamId,
                ...mockDto,
                createdAt: mockDate,
                updatedAt: mockDate,
            };
            prismaMock.teamMeeting.create.mockResolvedValue(
                expectedMeeting as any,
            );

            const result = await service.createTeamMeeting(
                teamId,
                sprintNumber,
                mockDto,
                createMockData.request,
            );

            expect(findSprintSpy).toHaveBeenCalledWith(teamId, sprintNumber);
            expect(result).toEqual(expectedMeeting);
            expect(result.title).toEqual(mockDto.title);
            expect(result.description).toEqual(mockDto.description);
            expect(result.meetingLink).toEqual(mockDto.meetingLink);
            expect(result.dateTime).toEqual(mockDto.dateTime);
            expect(result.notes).toEqual(mockDto.notes);
        });

        it("should handle optional fields in meeting creation", async () => {
            const teamId = 1;
            const sprintNumber = 1;
            const sprintId = 1;

            jest.spyOn(service, "findSprintIdBySprintNumber").mockResolvedValue(
                sprintId,
            );

            prismaMock.teamMeeting.findFirst.mockResolvedValue(null);

            const minimalMeetingDto = {
                title: "Minimal Meeting",
                dateTime: new Date(),
            };

            const expectedMeeting = {
                id: 1,
                sprintId,
                voyageTeamId: teamId,
                ...minimalMeetingDto,
                description: null,
                meetingLink: null,
                notes: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.teamMeeting.create.mockResolvedValue(
                expectedMeeting as any,
            );

            const result = await service.createTeamMeeting(
                teamId,
                sprintNumber,
                minimalMeetingDto as any,
                createMockData.request,
            );

            expect(result).toEqual(expectedMeeting);
            expect(result.description).toBeNull();
            expect(result.meetingLink).toBeNull();
            expect(result.notes).toBeNull();
        });
    });
    describe("updateTeamMeeting", () => {
        it("should be defined", () => {
            expect(service.updateTeamMeeting).toBeDefined();
        });
        it("should update a team meeting successfully", async () => {
            const meetingId = 1;
            const mockDto = createMockData.updateTeamMeetingDto();
            const mockUpdatedMeeting = createMockData.meeting(meetingId, {
                ...mockDto,
                sprintId: 1,
                voyageTeamId: 1,
            });

            prismaMock.teamMeeting.update.mockResolvedValue(
                mockUpdatedMeeting as TeamMeeting,
            );

            const result = await service.updateTeamMeeting(
                meetingId,
                mockDto,
                createMockData.request,
            );
            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledWith({
                user: createMockData.request.user,
                meetingId,
            });
            expect(result).toEqual(mockUpdatedMeeting);
            expect(prismaMock.teamMeeting.update).toHaveBeenCalledWith({
                where: { id: meetingId },
                data: mockDto,
            });
        });

        it("should update meeting with partial data", async () => {
            const meetingId = 1;
            const mockDto = createMockData.updateTeamMeetingDto();
            const partialUpdateDto = {
                title: "Updated Title Only",
                notes: "Updated Notes Only",
            };

            const mockUpdatedMeeting = {
                id: meetingId,
                ...mockDto, // Original data
                ...partialUpdateDto, // Overwrite with partial updates
                sprintId: 1,
                voyageTeamId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.teamMeeting.update.mockResolvedValue(
                mockUpdatedMeeting as TeamMeeting,
            );

            const result = await service.updateTeamMeeting(
                meetingId,
                partialUpdateDto,
                createMockData.request,
            );

            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledWith({
                user: createMockData.request.user,
                meetingId,
            });

            expect(result).toEqual(mockUpdatedMeeting);
            expect(prismaMock.teamMeeting.update).toHaveBeenCalledWith({
                where: { id: meetingId },
                data: partialUpdateDto,
            });
        });

        it("should preserve existing data for fields not included in update", async () => {
            const meetingId = 1;
            const partialUpdateDto = {
                title: "Only Update Title",
            };

            const originalMeeting = {
                id: meetingId,
                title: "Original Title",
                description: "Original Description",
                meetingLink: "Original Link",
                dateTime: new Date(),
                notes: "Original Notes",
                sprintId: 1,
                voyageTeamId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const expectedUpdatedMeeting = {
                ...originalMeeting,
                title: partialUpdateDto.title,
                updatedAt: expect.any(Date),
            };

            prismaMock.teamMeeting.update.mockResolvedValue(
                expectedUpdatedMeeting as TeamMeeting,
            );

            const result = await service.updateTeamMeeting(
                meetingId,
                partialUpdateDto,
                createMockData.request,
            );
            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledWith({
                user: createMockData.request.user,
                meetingId,
            });
            expect(result).toEqual(expectedUpdatedMeeting);
            expect(result.description).toBe(originalMeeting.description);
            expect(result.meetingLink).toBe(originalMeeting.meetingLink);
            expect(result.notes).toBe(originalMeeting.notes);
        });

        it("should update meeting dates correctly", async () => {
            const meetingId = 1;
            const newDateTime = new Date("2024-11-01T15:00:00.000Z");
            const mockDto = createMockData.updateTeamMeetingDto();
            const updateDto = {
                dateTime: newDateTime,
            };

            const mockUpdatedMeeting = {
                id: meetingId,
                ...mockDto,
                dateTime: newDateTime,
                sprintId: 1,
                voyageTeamId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.teamMeeting.update.mockResolvedValue(
                mockUpdatedMeeting as TeamMeeting,
            );

            const result = await service.updateTeamMeeting(
                meetingId,
                updateDto,
                createMockData.request,
            );
            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledWith({
                user: createMockData.request.user,
                meetingId,
            });
            expect(result.dateTime).toEqual(newDateTime);
            expect(prismaMock.teamMeeting.update).toHaveBeenCalledWith({
                where: { id: meetingId },
                data: updateDto,
            });
        });
    });
    describe("createMeetingAgenda", () => {
        const mockRequest = {
            user: {
                userId: "1",
                email: "test@test.com",
                roles: ["admin"],
                isVerified: true,
                voyageTeams: [1],
            },
        } as unknown as CustomRequest;

        const mockCreateAgendaDto = {
            title: "Test Agenda",
            description: "Test agenda description",
            status: false,
        } as CreateAgendaDto;

        beforeEach(() => {
            jest.mocked(manageOwnTeamMeetingOrAgendaById).mockClear();
            jest.mocked(manageOwnTeamMeetingOrAgendaById).mockResolvedValue(
                undefined,
            );
        });
        it("should be defined", () => {
            expect(service.createMeetingAgenda).toBeDefined();
        });
        it("should create a meeting agenda successfully", async () => {
            const meetingId = 1;

            const mockCreatedAgenda = {
                id: 1,
                teamMeetingId: meetingId,
                ...mockCreateAgendaDto,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Agenda;

            prismaMock.agenda.create.mockResolvedValue(mockCreatedAgenda);

            const result = await service.createMeetingAgenda(
                meetingId,
                mockCreateAgendaDto,
                mockRequest,
            );

            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledWith({
                user: mockRequest.user,
                meetingId,
            });
            expect(result).toEqual(mockCreatedAgenda);
            expect(prismaMock.agenda.create).toHaveBeenCalledWith({
                data: {
                    teamMeetingId: meetingId,
                    ...mockCreateAgendaDto,
                },
            });
        });

        it("should create agenda with all provided fields", async () => {
            const meetingId = 1;

            const mockCreatedAgenda = {
                id: 1,
                teamMeetingId: meetingId,
                title: mockCreateAgendaDto.title,
                description: mockCreateAgendaDto.description,
                status: mockCreateAgendaDto.status,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Agenda;

            prismaMock.agenda.create.mockResolvedValue(mockCreatedAgenda);

            const result = await service.createMeetingAgenda(
                meetingId,
                mockCreateAgendaDto,
                mockRequest,
            );

            expect(result.title).toBe(mockCreateAgendaDto.title);
            expect(result.description).toBe(mockCreateAgendaDto.description);
            expect(result.status).toBe(mockCreateAgendaDto.status);
            expect(result.teamMeetingId).toBe(meetingId);
        });

        it("should validate meeting ownership before creating agenda", async () => {
            const meetingId = 1;

            const mockCreatedAgenda = {
                id: 1,
                teamMeetingId: meetingId,
                ...mockCreateAgendaDto,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Agenda;

            prismaMock.agenda.create.mockResolvedValue(mockCreatedAgenda);

            await service.createMeetingAgenda(
                meetingId,
                mockCreateAgendaDto,
                mockRequest,
            );

            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledWith({
                user: mockRequest.user,
                meetingId,
            });
        });

        it("should handle agenda creation with default status", async () => {
            const meetingId = 1;
            const agendaDtoWithoutStatus = {
                title: "Test Agenda",
                description: "Test agenda description",
            };

            const mockCreatedAgenda = {
                id: 1,
                teamMeetingId: meetingId,
                ...agendaDtoWithoutStatus,
                status: false, // Default status
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Agenda;

            prismaMock.agenda.create.mockResolvedValue(mockCreatedAgenda);

            const result = await service.createMeetingAgenda(
                meetingId,
                agendaDtoWithoutStatus as any,
                mockRequest,
            );

            expect(result.status).toBeFalse();
            expect(prismaMock.agenda.create).toHaveBeenCalledWith({
                data: {
                    teamMeetingId: meetingId,
                    ...agendaDtoWithoutStatus,
                },
            });
        });
    });
    describe("updateMeetingAgenda", () => {
        const mockRequest = {
            user: {
                userId: "1",
                email: "test@test.com",
                roles: ["admin"],
                isVerified: true,
                voyageTeams: [1],
            },
        } as unknown as CustomRequest;

        const mockUpdateAgendaDto = {
            title: "Updated Agenda Title",
            description: "Updated agenda description",
            status: true,
        } as UpdateAgendaDto;

        beforeEach(() => {
            jest.mocked(manageOwnTeamMeetingOrAgendaById).mockClear();
            jest.mocked(manageOwnTeamMeetingOrAgendaById).mockResolvedValue(
                undefined,
            );
        });
        it("should be defined", () => {
            expect(service.updateMeetingAgenda).toBeDefined();
        });
        it("should update an agenda successfully", async () => {
            const agendaId = 1;

            const mockUpdatedAgenda = {
                id: agendaId,
                teamMeetingId: 1,
                ...mockUpdateAgendaDto,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Agenda;

            prismaMock.agenda.update.mockResolvedValue(mockUpdatedAgenda);

            const result = await service.updateMeetingAgenda(
                agendaId,
                mockUpdateAgendaDto,
                mockRequest,
            );

            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledWith({
                user: mockRequest.user,
                agendaId,
            });
            expect(result).toEqual(mockUpdatedAgenda);
            expect(prismaMock.agenda.update).toHaveBeenCalledWith({
                where: { id: agendaId },
                data: mockUpdateAgendaDto,
            });
        });

        it("should update agenda with partial data", async () => {
            const agendaId = 1;
            const partialUpdateDto = {
                title: "Only Update Title",
                status: true,
            } as UpdateAgendaDto;

            const mockUpdatedAgenda = {
                id: agendaId,
                teamMeetingId: 1,
                title: partialUpdateDto.title,
                description: "Original description",
                status: partialUpdateDto.status,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Agenda;

            prismaMock.agenda.update.mockResolvedValue(mockUpdatedAgenda);

            const result = await service.updateMeetingAgenda(
                agendaId,
                partialUpdateDto,
                mockRequest,
            );

            expect(result).toEqual(mockUpdatedAgenda);
            expect(prismaMock.agenda.update).toHaveBeenCalledWith({
                where: { id: agendaId },
                data: partialUpdateDto,
            });
        });

        it("should preserve existing data for fields not included in update", async () => {
            const agendaId = 1;
            const partialUpdateDto = {
                title: "Only Update Title",
            } as UpdateAgendaDto;

            const originalAgenda = {
                id: agendaId,
                teamMeetingId: 1,
                title: "Original Title",
                description: "Original Description",
                status: false,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Agenda;

            const expectedUpdatedAgenda = {
                ...originalAgenda,
                title: partialUpdateDto.title,
                updatedAt: mockDate,
            } as Agenda;

            prismaMock.agenda.update.mockResolvedValue(expectedUpdatedAgenda);

            const result = await service.updateMeetingAgenda(
                agendaId,
                partialUpdateDto,
                mockRequest,
            );

            expect(result.title).toBe(partialUpdateDto.title);
            expect(result.description).toBe(originalAgenda.description);
            expect(result.status).toBe(originalAgenda.status);
        });

        it("should validate ownership before updating agenda", async () => {
            const agendaId = 1;
            const mockUpdatedAgenda = {
                id: agendaId,
                teamMeetingId: 1,
                ...mockUpdateAgendaDto,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Agenda;

            prismaMock.agenda.update.mockResolvedValue(mockUpdatedAgenda);

            await service.updateMeetingAgenda(
                agendaId,
                mockUpdateAgendaDto,
                mockRequest,
            );

            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledWith({
                user: mockRequest.user,
                agendaId,
            });
        });
        it("should handle Prisma error for non-existent agenda", async () => {
            const nonExistentAgendaId = 999;

            // Mock Prisma throwing an error for non-existent record
            prismaMock.agenda.update.mockRejectedValue(
                new Error("Record not found"),
            );

            await expect(
                service.updateMeetingAgenda(
                    nonExistentAgendaId,
                    mockUpdateAgendaDto,
                    mockRequest,
                ),
            ).rejects.toThrow();

            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledWith({
                user: mockRequest.user,
                agendaId: nonExistentAgendaId,
            });
        });

        it("should verify Prisma update call parameters", async () => {
            const agendaId = 1;
            const mockUpdatedAgenda = {
                id: agendaId,
                teamMeetingId: 1,
                ...mockUpdateAgendaDto,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Agenda;

            prismaMock.agenda.update.mockResolvedValue(mockUpdatedAgenda);

            await service.updateMeetingAgenda(
                agendaId,
                mockUpdateAgendaDto,
                mockRequest,
            );

            // Verify exact structure of Prisma update call
            expect(prismaMock.agenda.update).toHaveBeenCalledWith({
                where: {
                    id: agendaId,
                },
                data: {
                    title: mockUpdateAgendaDto.title,
                    description: mockUpdateAgendaDto.description,
                    status: mockUpdateAgendaDto.status,
                },
            });

            // Verify it was called exactly once
            expect(prismaMock.agenda.update).toHaveBeenCalledOnce();
        });
    });
    describe("deleteMeetingAgenda", () => {
        const mockRequest = {
            user: {
                userId: "1",
                email: "test@test.com",
                roles: ["admin"],
                isVerified: true,
                voyageTeams: [1],
            },
        } as unknown as CustomRequest;

        beforeEach(() => {
            jest.mocked(manageOwnTeamMeetingOrAgendaById).mockClear();
            jest.mocked(manageOwnTeamMeetingOrAgendaById).mockResolvedValue(
                undefined,
            );
        });
        it("should be defined", () => {
            expect(service.deleteMeetingAgenda).toBeDefined();
        });
        it("should delete an agenda successfully", async () => {
            const agendaId = 1;

            const mockDeletedAgenda = {
                id: agendaId,
                teamMeetingId: 1,
                title: "Agenda to delete",
                description: "This agenda will be deleted",
                status: false,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Agenda;

            prismaMock.agenda.delete.mockResolvedValue(mockDeletedAgenda);

            const result = await service.deleteMeetingAgenda(
                agendaId,
                mockRequest,
            );

            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledWith({
                user: mockRequest.user,
                agendaId,
            });
            expect(result).toEqual(mockDeletedAgenda);
            expect(prismaMock.agenda.delete).toHaveBeenCalledWith({
                where: { id: agendaId },
            });
        });

        it("should verify the exact Prisma delete call", async () => {
            const agendaId = 1;

            const mockDeletedAgenda = {
                id: agendaId,
                teamMeetingId: 1,
                title: "Agenda to delete",
                description: "This agenda will be deleted",
                status: false,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Agenda;

            prismaMock.agenda.delete.mockResolvedValue(mockDeletedAgenda);

            await service.deleteMeetingAgenda(agendaId, mockRequest);

            expect(prismaMock.agenda.delete).toHaveBeenCalledWith({
                where: { id: agendaId },
            });
            expect(prismaMock.agenda.delete).toHaveBeenCalledOnce();
        });

        it("should handle Prisma error for non-existent agenda", async () => {
            const nonExistentAgendaId = 999;

            prismaMock.agenda.delete.mockRejectedValue(
                new Error("Record not found"),
            );

            await expect(
                service.deleteMeetingAgenda(nonExistentAgendaId, mockRequest),
            ).rejects.toThrow();

            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledWith({
                user: mockRequest.user,
                agendaId: nonExistentAgendaId,
            });
        });

        it("should validate ownership before deleting agenda", async () => {
            const agendaId = 1;

            const mockDeletedAgenda = {
                id: agendaId,
                teamMeetingId: 1,
                title: "Agenda to delete",
                description: "This agenda will be deleted",
                status: false,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Agenda;

            prismaMock.agenda.delete.mockResolvedValue(mockDeletedAgenda);

            await service.deleteMeetingAgenda(agendaId, mockRequest);

            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledWith({
                user: mockRequest.user,
                agendaId,
            });
            expect(manageOwnTeamMeetingOrAgendaById).toHaveBeenCalledOnce();
        });
    });
    describe("getMeetingFormQuestionsWithResponses", () => {
        it("should be defined", () => {
            expect(service.getMeetingFormQuestionsWithResponses).toBeDefined();
        });
        describe("getMeetingFormQuestionsWithResponses", () => {
            it("should get form questions with responses when response exists", async () => {
                const meetingId = 1;
                const formId = 1;

                // Mock meeting find
                const mockMeeting = createMockData.meeting(meetingId, {
                    voyageTeamId: 1,
                });

                // Mock form response find with correct structure
                const mockFormResponse =
                    createMockData.formResponseMeetingWithId(meetingId, formId);

                // Mock form with expected structure
                const mockForm = createMockData.formWithQuestions(formId, {
                    questions: [
                        {
                            ...createMockData.formWithQuestions(formId)
                                .questions[0],
                            responses: [
                                {
                                    optionChoice: null,
                                    numeric: null,
                                    boolean: null,
                                    text: "Answer 1",
                                },
                            ],
                        },
                    ],
                });

                // Setup mocks
                prismaMock.teamMeeting.findUnique.mockResolvedValue(
                    mockMeeting,
                );
                prismaMock.formResponseMeeting.findUnique.mockResolvedValue({
                    id: mockFormResponse.meetingFormId.meetingId,
                    formId: formId,
                    meetingId: meetingId,
                    responseGroupId: mockFormResponse.responseGroupId,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                });
                prismaMock.form.findUnique.mockResolvedValue(mockForm as any);

                const result =
                    await service.getMeetingFormQuestionsWithResponses(
                        meetingId,
                        formId,
                        createMockData.request,
                    );

                expect(result).toEqual(mockForm);
                expect(prismaMock.teamMeeting.findUnique).toHaveBeenCalledWith({
                    where: { id: meetingId },
                    select: { voyageTeamId: true },
                });

                expect(prismaMock.form.findUnique).toHaveBeenCalledWith({
                    where: { id: formId },
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
                                            mockFormResponse.responseGroupId,
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
            });
        });

        it("should get form questions without responses for a new form", async () => {
            const meetingId = 1;
            const formId = 1;

            // Mock meeting find
            const mockMeeting = {
                id: meetingId,
                voyageTeamId: 1,
            } as TeamMeeting;

            prismaMock.teamMeeting.findUnique.mockResolvedValue(mockMeeting);

            // Mock no existing form response
            prismaMock.formResponseMeeting.findUnique.mockResolvedValue(null);

            // Mock form type check
            prismaMock.form.findUnique.mockResolvedValue({
                id: formId,
                formType: {
                    name: "meeting",
                },
            } as any);

            // Mock form service getFormById
            const mockFormWithoutResponses = {
                id: formId,
                title: "Test Form",
                description: null,
                formType: {
                    name: "meeting",
                    id: 1,
                },
                questions: [],
            };

            jest.spyOn(formService, "getFormById").mockResolvedValue(
                mockFormWithoutResponses,
            );

            const result = await service.getMeetingFormQuestionsWithResponses(
                meetingId,
                formId,
                createMockData.request,
            );

            expect(result).toEqual(mockFormWithoutResponses);
            expect(formService.getFormById).toHaveBeenCalledWith(
                formId,
                createMockData.request,
            );
        });

        it("should verify correct structure of returned form data", async () => {
            const meetingId = 1;
            const formId = 1;

            const mockMeeting = {
                id: meetingId,
                voyageTeamId: 1,
            } as TeamMeeting;

            prismaMock.teamMeeting.findUnique.mockResolvedValue(mockMeeting);

            const mockFormResponse = {
                meetingId,
                formId,
                responseGroupId: 1,
            } as FormResponseMeeting;

            prismaMock.formResponseMeeting.findUnique.mockResolvedValue(
                mockFormResponse,
            );

            const mockForm = {
                id: formId,
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
                        optionGroup: null,
                        responses: [],
                    },
                ],
            };

            prismaMock.form.findUnique.mockResolvedValue(mockForm as any);

            const result = await service.getMeetingFormQuestionsWithResponses(
                meetingId,
                formId,
                createMockData.request,
            );

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    formType: expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                    }),
                    title: expect.any(String),
                    questions: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            order: expect.any(Number),
                            inputType: expect.objectContaining({
                                id: expect.any(Number),
                                name: expect.any(String),
                            }),
                            text: expect.any(String),
                            description: expect.any(String),
                            answerRequired: expect.any(Boolean),
                            responses: expect.any(Array),
                        }),
                    ]),
                }),
            );
        });
    });
    describe("updateMeetingFormResponse", () => {
        const mockUpdateFormResponseDto = {
            responses: [
                {
                    questionId: 1,
                    text: "Updated response text",
                },
            ],
        };

        it("should update meeting form response successfully", async () => {
            const meetingId = 1;
            const formId = 1;

            // Mock meeting existence check
            const mockMeeting = {
                voyageTeamId: 1,
            } as TeamMeeting;

            // Mock form response existence check
            const mockFormResponse = {
                id: 1,
                responseGroupId: 1,
            } as FormResponseMeeting;

            // Mock existing response check and update
            const mockUpdatedResponse = {
                id: 1,
                questionId: 1,
                text: "Updated response text",
                responseGroupId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Response;

            prismaMock.teamMeeting.findUnique.mockResolvedValue(mockMeeting);
            prismaMock.formResponseMeeting.findUnique.mockResolvedValue(
                mockFormResponse,
            );

            // Mock checking questions in form
            jest.spyOn(globalService, "responseDtoToArray").mockReturnValue([
                {
                    questionId: 1,
                    text: "Updated response text",
                },
            ]);

            prismaMock.response.findFirst.mockResolvedValue({
                id: 1,
                questionId: 1,
                responseGroupId: 1,
            } as Response);

            prismaMock.response.update.mockResolvedValue(mockUpdatedResponse);
            prismaMock.$transaction.mockResolvedValue([mockUpdatedResponse]);

            const result = await service.updateMeetingFormResponse(
                meetingId,
                formId,
                mockUpdateFormResponseDto,
                createMockData.request,
            );

            expect(result).toEqual([mockUpdatedResponse]);
            expect(globalService.responseDtoToArray).toHaveBeenCalledWith(
                mockUpdateFormResponseDto,
            );
            expect(globalService.checkQuestionsInFormById).toHaveBeenCalledWith(
                formId,
                expect.any(Array),
            );
        });

        it("should create new response if it doesn't exist", async () => {
            const meetingId = 1;
            const formId = 1;

            // Mock meeting existence check
            const mockMeeting = {
                voyageTeamId: 1,
            } as TeamMeeting;

            // Mock form response existence check
            const mockFormResponse = {
                id: 1,
                responseGroupId: 1,
            } as FormResponseMeeting;

            // Mock create new response
            const mockCreatedResponse = {
                id: 1,
                questionId: 1,
                text: "New response text",
                responseGroupId: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
            } as Response;

            prismaMock.teamMeeting.findUnique.mockResolvedValue(mockMeeting);
            prismaMock.formResponseMeeting.findUnique.mockResolvedValue(
                mockFormResponse,
            );

            // Mock checking questions in form
            jest.spyOn(globalService, "responseDtoToArray").mockReturnValue([
                {
                    questionId: 1,
                    text: "New response text",
                },
            ]);

            // Mock no existing response found
            prismaMock.response.findFirst.mockResolvedValue(null);
            prismaMock.response.create.mockResolvedValue(mockCreatedResponse);

            // Mock the transaction to actually execute the callback
            prismaMock.$transaction.mockImplementation(async (callback) => {
                if (typeof callback === "function") {
                    // Execute the callback with our mock prisma client
                    const results = await Promise.all([callback(prismaMock)]);
                    return results.flat();
                }
                return [mockCreatedResponse];
            });

            const result = await service.updateMeetingFormResponse(
                meetingId,
                formId,
                mockUpdateFormResponseDto,
                createMockData.request,
            );

            expect(result).toEqual([mockCreatedResponse]);
            expect(prismaMock.response.create).toHaveBeenCalledWith({
                data: {
                    responseGroupId: mockFormResponse.responseGroupId,
                    questionId: 1,
                    text: "New response text",
                },
            });
        });

        it("should handle multiple responses in transaction", async () => {
            const meetingId = 1;
            const formId = 1;

            const multipleResponsesDto = {
                responses: [
                    {
                        questionId: 1,
                        text: "First response",
                    },
                    {
                        questionId: 2,
                        text: "Second response",
                    },
                ],
            };

            // Mock transaction responses
            const mockUpdatedResponses = multipleResponsesDto.responses.map(
                (resp) => createMockData.response(resp.questionId, resp.text),
            );

            // Mock meeting and form response checks
            prismaMock.teamMeeting.findUnique.mockResolvedValue(
                createMockData.meeting(1, { voyageTeamId: 1 }),
            );
            prismaMock.formResponseMeeting.findUnique.mockResolvedValue(
                createMockData.formResponse(1, {
                    id: 1,
                    responseGroupId: 1,
                }),
            );

            // Mock response array transformation
            jest.spyOn(globalService, "responseDtoToArray").mockReturnValue(
                multipleResponsesDto.responses,
            );

            // Mock the transaction itself
            prismaMock.$transaction.mockResolvedValue(mockUpdatedResponses);

            const result = await service.updateMeetingFormResponse(
                meetingId,
                formId,
                multipleResponsesDto,
                createMockData.request,
            );

            expect(result).toEqual(mockUpdatedResponses);
            expect(globalService.responseDtoToArray).toHaveBeenCalledWith(
                multipleResponsesDto,
            );
            expect(globalService.checkQuestionsInFormById).toHaveBeenCalledWith(
                formId,
                expect.any(Array),
            );
        });
    });
    describe("addCheckinFormResponse", () => {
        const mockCreateCheckinFormDto = {
            voyageTeamMemberId: 1,
            sprintId: 1,
            responses: [
                {
                    questionId: 1,
                    text: "Check-in response",
                },
            ],
        };

        const mockTeamMemberData = {
            id: 1,
            userId: "1",
            voyageTeam: {
                id: 1,
                voyage: {
                    id: 1,
                    sprints: [
                        {
                            id: 1,
                            number: 1,
                            startDate: mockDate,
                            endDate: mockDate,
                        },
                    ],
                },
            },
        };

        // Mock response group creation
        const mockResponseGroup = {
            id: 1,
            createdAt: mockDate,
            updatedAt: mockDate,
        };

        // Mock form response checkin creation
        const mockCheckinSubmission = {
            id: 1,
            voyageTeamMemberId: mockCreateCheckinFormDto.voyageTeamMemberId,
            sprintId: mockCreateCheckinFormDto.sprintId,
            responseGroupId: mockResponseGroup.id,
            createdAt: mockDate,
            updatedAt: mockDate,
            adminComments: null,
            feedbackSent: false,
        } as FormResponseCheckin;

        // Helper function to setup transaction mock
        const setupTransactionMock = (returnValue: any) => {
            prismaMock.$transaction.mockImplementation(async (callback) => {
                prismaMock.responseGroup.create.mockResolvedValue(
                    mockResponseGroup,
                );
                prismaMock.formResponseCheckin.create.mockResolvedValue(
                    mockCheckinSubmission,
                );

                if (typeof callback === "function") {
                    return callback(prismaMock);
                }
                return returnValue;
            });
        };
        beforeEach(() => {
            // Setup globalService mocks
            jest.spyOn(globalService, "responseDtoToArray").mockReturnValue([
                {
                    questionId: 1,
                    text: "Check-in response",
                },
            ]);

            jest.spyOn(globalService, "validateOrGetDbItem").mockResolvedValue(
                mockTeamMemberData,
            );

            jest.spyOn(
                globalService,
                "checkQuestionsInFormByTitle",
            ).mockResolvedValue(undefined);

            setupTransactionMock(mockCheckinSubmission);
        });
        describe("successful submissions", () => {
            it("should create checkin form response successfully", async () => {
                const result = await service.addCheckinFormResponse(
                    mockCreateCheckinFormDto,
                );

                expect(result).toEqual({
                    id: mockCheckinSubmission.id,
                    voyageTeamMemberId:
                        mockCheckinSubmission.voyageTeamMemberId,
                    sprintId: mockCheckinSubmission.sprintId,
                    responseGroupId: mockCheckinSubmission.responseGroupId,
                    createdAt: mockCheckinSubmission.createdAt,
                });

                expect(globalService.responseDtoToArray).toHaveBeenCalledWith(
                    mockCreateCheckinFormDto,
                );
                expect(
                    globalService.checkQuestionsInFormByTitle,
                ).toHaveBeenCalled();
            });

            it("should create response group with multiple responses", async () => {
                const mockResponses = [
                    createMockData.response(1, "Response 1"),
                    createMockData.response(2, "Response 2"),
                ];
                const formattedResponses = mockResponses.map((response) => ({
                    ...response,
                    text: response.text !== null ? response.text : undefined,
                    boolean:
                        response.boolean !== null
                            ? response.boolean
                            : undefined,
                    numeric:
                        response.numeric !== null
                            ? response.numeric
                            : undefined,
                    optionChoiceId:
                        response.optionChoiceId !== null
                            ? response.optionChoiceId
                            : undefined,
                }));
                const mockCheckinSubmission = {
                    ...createMockData.formResponse(1),
                    voyageTeamMemberId: 1,
                    sprintId: 1,
                    responseGroupId: 1,
                    adminComments: null,
                    feedbackSent: false,
                };
                jest.spyOn(globalService, "responseDtoToArray").mockReturnValue(
                    mockResponses,
                );

                prismaMock.$transaction.mockResolvedValue(
                    mockCheckinSubmission,
                );

                const result = await service.addCheckinFormResponse({
                    voyageTeamMemberId: 1,
                    sprintId: 1,
                    responses: formattedResponses,
                });

                expect(result).toEqual({
                    id: mockCheckinSubmission.id,
                    voyageTeamMemberId:
                        mockCheckinSubmission.voyageTeamMemberId,
                    sprintId: mockCheckinSubmission.sprintId,
                    responseGroupId: mockCheckinSubmission.responseGroupId,
                    createdAt: mockCheckinSubmission.createdAt,
                });
            });
        });

        describe("error cases", () => {
            it("should handle duplicate submission error", async () => {
                // Mock Prisma throwing a unique constraint violation error
                prismaMock.$transaction.mockRejectedValue({
                    code: "P2002",
                    clientVersion: "5.0.0",
                    meta: {
                        target: ["voyageTeamMemberId", "sprintId"],
                    },
                });

                await expect(
                    service.addCheckinFormResponse(mockCreateCheckinFormDto),
                ).rejects.toThrow(
                    `User ${mockCreateCheckinFormDto.voyageTeamMemberId} has already submitted a checkin form for sprint id ${mockCreateCheckinFormDto.sprintId}.`,
                );
            });

            it("should handle validation error for responses array", async () => {
                // Mock Prisma throwing a validation error
                prismaMock.$transaction.mockRejectedValue({
                    name: "PrismaClientValidationError",
                    clientVersion: "5.0.0",
                });

                await expect(
                    service.addCheckinFormResponse(mockCreateCheckinFormDto),
                ).rejects.toThrow(
                    "Bad request - type error in responses array",
                );
            });

            it("should handle case when user is not part of the sprint's voyage team", async () => {
                // Mock team member data without the sprint
                const invalidTeamMemberData = {
                    id: 1,
                    userId: "1",
                    voyageTeam: {
                        id: 1,
                        voyage: {
                            id: 1,
                            sprints: [
                                {
                                    id: 2, // Different sprint ID than what's in the request
                                    number: 2,
                                    startDate: mockDate,
                                    endDate: mockDate,
                                },
                            ],
                        },
                    },
                };

                jest.spyOn(
                    globalService,
                    "validateOrGetDbItem",
                ).mockResolvedValue(invalidTeamMemberData);

                await expect(
                    service.addCheckinFormResponse(mockCreateCheckinFormDto),
                ).rejects.toThrow(
                    `Voyage team member id ${mockCreateCheckinFormDto.voyageTeamMemberId} is not part of the same voyage as sprint id ${mockCreateCheckinFormDto.sprintId}.`,
                );
            });

            it("should handle invalid question format in responses", async () => {
                const invalidResponses = [
                    {
                        // Missing questionId
                        text: "Invalid response",
                    },
                ];

                jest.spyOn(globalService, "responseDtoToArray").mockReturnValue(
                    invalidResponses as any,
                );
                // Mock transaction to throw a validation error
                prismaMock.$transaction.mockRejectedValue({
                    name: "PrismaClientValidationError",
                    message: "Invalid value for field questionId",
                });

                await expect(
                    service.addCheckinFormResponse({
                        ...mockCreateCheckinFormDto,
                        responses: invalidResponses as any,
                    }),
                ).rejects.toThrow(
                    "Bad request - type error in responses array",
                );
            });

            it("should handle case when sprint questions are not found", async () => {
                // Mock checkQuestionsInFormByTitle to throw an error
                jest.spyOn(
                    globalService,
                    "checkQuestionsInFormByTitle",
                ).mockRejectedValue(
                    new Error("Questions not found for this sprint"),
                );

                await expect(
                    service.addCheckinFormResponse(mockCreateCheckinFormDto),
                ).rejects.toThrow("Questions not found for this sprint");
            });

            it("should handle database errors during response group creation", async () => {
                const consoleSpy = jest
                    .spyOn(console, "log")
                    .mockImplementation();
                // Mock transaction failing during response group creation
                prismaMock.$transaction.mockImplementation(async () => {
                    throw new Error(
                        "Database error during response group creation",
                    );
                });

                await expect(
                    service.addCheckinFormResponse(mockCreateCheckinFormDto),
                ).rejects.toThrow(
                    "Database error during response group creation",
                );
                consoleSpy.mockRestore();
            });

            it("should handle empty responses array", async () => {
                const emptyResponsesDto = {
                    ...mockCreateCheckinFormDto,
                    responses: [],
                };
                // Mock checkQuestionsInFormByTitle to throw an error
                jest.spyOn(
                    globalService,
                    "checkQuestionsInFormByTitle",
                ).mockRejectedValue(
                    new Error("Questions not found for this sprint"),
                );
                await expect(
                    service.addCheckinFormResponse(emptyResponsesDto),
                ).rejects.toThrow();
            });

            it("should handle invalid sprint ID format", async () => {
                const invalidSprintIdDto = {
                    ...mockCreateCheckinFormDto,
                    sprintId: "invalid" as any,
                };

                await expect(
                    service.addCheckinFormResponse(invalidSprintIdDto),
                ).rejects.toThrow();
            });
        });
        describe("validations", () => {
            it("should verify form questions before submission", async () => {
                await service.addCheckinFormResponse(mockCreateCheckinFormDto);

                expect(
                    globalService.checkQuestionsInFormByTitle,
                ).toHaveBeenCalledWith(
                    [
                        FormTitles.sprintCheckin,
                        FormTitles.sprintCheckinPO,
                        FormTitles.sprintCheckinSM,
                    ],
                    expect.any(Array),
                );

                // Verify validateOrGetDbItem was called with correct parameters
                expect(globalService.validateOrGetDbItem).toHaveBeenCalledWith(
                    "voyageTeamMember",
                    mockCreateCheckinFormDto.voyageTeamMemberId,
                    "id",
                    "findUnique",
                    undefined,
                    {
                        select: {
                            voyageTeam: {
                                select: {
                                    voyage: {
                                        select: {
                                            sprints: {
                                                select: {
                                                    id: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                );
            });

            it("should validate user can submit checkin", async () => {
                await service.addCheckinFormResponse(mockCreateCheckinFormDto);

                expect(globalService.validateOrGetDbItem).toHaveBeenCalled();
            });
        });
    });
    describe("getCheckinFormResponse", () => {
        const mockCheckinFormResponse = {
            id: 1,
            voyageTeamMemberId: 1,
            sprintId: 1,
            responseGroupId: 1,
            voyageTeamMember: {
                voyageTeamId: 1,
            },
            sprint: {
                number: 1,
                voyage: {
                    number: "V47",
                },
            },
            responseGroup: {
                responses: [
                    {
                        id: 1,
                        questionId: 1,
                        text: "Test response",
                        question: {
                            id: 1,
                            text: "Test question",
                        },
                        optionChoice: null,
                    },
                ],
            },
            createdAt: mockDate,
            updatedAt: mockDate,
        } as unknown as FormResponseCheckin;

        describe("successful queries", () => {
            it("should return checkin form responses for valid query parameters", async () => {
                const query = {
                    teamId: 1,
                    sprintNumber: 1,
                    voyageNumber: "V47",
                } as unknown as CheckinQueryDto;

                jest.spyOn(
                    globalService,
                    "validateOrGetDbItem",
                ).mockResolvedValue(true);
                prismaMock.formResponseCheckin.findMany.mockResolvedValue([
                    mockCheckinFormResponse,
                ]);

                const result = await service.getCheckinFormResponse(query);

                expect(result).toEqual([mockCheckinFormResponse]);
                expect(
                    prismaMock.formResponseCheckin.findMany,
                ).toHaveBeenCalledWith({
                    where: {
                        voyageTeamMember: {
                            voyageTeamId: 1,
                        },
                        sprint: {
                            number: 1,
                            voyage: {
                                number: "V47",
                            },
                        },
                    },
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
            });

            it("should return empty array when no responses match query", async () => {
                const query = {
                    teamId: 999,
                    sprintNumber: 999,
                };

                jest.spyOn(
                    globalService,
                    "validateOrGetDbItem",
                ).mockResolvedValue(true);
                prismaMock.formResponseCheckin.findMany.mockResolvedValue([]);

                const result = await service.getCheckinFormResponse(query);

                expect(result).toEqual([]);
            });

            it("should handle partial query parameters", async () => {
                const query = {
                    teamId: 1,
                };

                jest.spyOn(
                    globalService,
                    "validateOrGetDbItem",
                ).mockResolvedValue(true);
                prismaMock.formResponseCheckin.findMany.mockResolvedValue([
                    mockCheckinFormResponse,
                ]);

                const result = await service.getCheckinFormResponse(query);

                expect(result).toEqual([mockCheckinFormResponse]);
                expect(
                    prismaMock.formResponseCheckin.findMany,
                ).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: {
                            voyageTeamMember: {
                                voyageTeamId: 1,
                            },
                        },
                    }),
                );
            });

            it("should filter out empty responses", async () => {
                const query = {
                    teamId: 1,
                    sprintNumber: 1,
                };

                jest.spyOn(
                    globalService,
                    "validateOrGetDbItem",
                ).mockResolvedValue(true);
                prismaMock.formResponseCheckin.findMany.mockResolvedValue([
                    mockCheckinFormResponse,
                    {} as any, // Empty response
                    mockCheckinFormResponse,
                ]);

                const result = await service.getCheckinFormResponse(query);

                expect(result).toEqual([
                    mockCheckinFormResponse,
                    mockCheckinFormResponse,
                ]);
                expect(result).toHaveLength(2);
            });
        });

        describe("validation and error handling", () => {
            it("should throw BadRequestException for invalid query parameter", async () => {
                const query = {
                    invalidParam: "value",
                } as any;

                await expect(
                    service.getCheckinFormResponse(query),
                ).rejects.toThrow(BadRequestException);
                await expect(
                    service.getCheckinFormResponse(query),
                ).rejects.toThrow(
                    "Query invalidParam did not match any keywords",
                );
            });

            it("should validate teamId exists in database", async () => {
                const query = {
                    teamId: 999,
                };

                jest.spyOn(
                    globalService,
                    "validateOrGetDbItem",
                ).mockRejectedValue(new NotFoundException("Team not found"));

                await expect(
                    service.getCheckinFormResponse(query),
                ).rejects.toThrow(NotFoundException);
                expect(globalService.validateOrGetDbItem).toHaveBeenCalledWith(
                    "voyageTeam",
                    999,
                );
            });

            it("should validate sprintNumber exists in database", async () => {
                const query = {
                    sprintNumber: 999,
                };

                jest.spyOn(
                    globalService,
                    "validateOrGetDbItem",
                ).mockRejectedValue(new NotFoundException("Sprint not found"));

                await expect(
                    service.getCheckinFormResponse(query),
                ).rejects.toThrow(NotFoundException);
                expect(globalService.validateOrGetDbItem).toHaveBeenCalledWith(
                    "sprint",
                    999,
                    "number",
                    "findFirst",
                );
            });

            it("should validate voyageNumber exists in database", async () => {
                const query = {
                    voyageNumber: "V999",
                };

                jest.spyOn(
                    globalService,
                    "validateOrGetDbItem",
                ).mockRejectedValue(new NotFoundException("Voyage not found"));

                await expect(
                    service.getCheckinFormResponse(query),
                ).rejects.toThrow(NotFoundException);
                expect(globalService.validateOrGetDbItem).toHaveBeenCalledWith(
                    "voyage",
                    "V999",
                    "number",
                );
            });

            it("should validate userId exists in database", async () => {
                const query = {
                    userId: "non-existent-user",
                };

                jest.spyOn(
                    globalService,
                    "validateOrGetDbItem",
                ).mockRejectedValue(new NotFoundException("User not found"));

                await expect(
                    service.getCheckinFormResponse(query),
                ).rejects.toThrow(NotFoundException);
                expect(globalService.validateOrGetDbItem).toHaveBeenCalledWith(
                    "user",
                    "non-existent-user",
                );
            });
        });

        describe("query building", () => {
            it("should build correct query with multiple parameters", async () => {
                const query = {
                    teamId: 1,
                    sprintNumber: 1,
                    voyageNumber: "V47",
                    userId: "user-1",
                };

                jest.spyOn(
                    globalService,
                    "validateOrGetDbItem",
                ).mockResolvedValue(true);
                prismaMock.formResponseCheckin.findMany.mockResolvedValue([
                    mockCheckinFormResponse,
                ]);

                await service.getCheckinFormResponse(query);

                expect(
                    prismaMock.formResponseCheckin.findMany,
                ).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: {
                            voyageTeamMember: {
                                voyageTeamId: 1,
                                userId: "user-1",
                            },
                            sprint: {
                                number: 1,
                                voyage: {
                                    number: "V47",
                                },
                            },
                        },
                    }),
                );
            });

            it("should ignore null or undefined query parameters", async () => {
                const query = {
                    teamId: 1,
                    sprintNumber: null,
                    voyageNumber: undefined,
                    userId: "",
                } as unknown as CheckinQueryDto;

                jest.spyOn(
                    globalService,
                    "validateOrGetDbItem",
                ).mockResolvedValue(true);
                prismaMock.formResponseCheckin.findMany.mockResolvedValue([
                    mockCheckinFormResponse,
                ]);

                await service.getCheckinFormResponse(query);

                expect(
                    prismaMock.formResponseCheckin.findMany,
                ).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: {
                            voyageTeamMember: {
                                voyageTeamId: 1,
                            },
                        },
                    }),
                );
            });
        });
    });
});
