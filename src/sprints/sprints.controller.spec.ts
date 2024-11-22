import { Test, TestingModule } from '@nestjs/testing';
import { SprintsController } from './sprints.controller';
import { SprintsService } from './sprints.service';
import { NotFoundException, UnauthorizedException, ForbiddenException, ConflictException } from '@nestjs/common';
import { CustomRequest } from '@/global/types/CustomRequest';
import { createMockData, mockDate } from './mock-data';
import { CreateTeamMeetingDto } from './dto/create-team-meeting.dto';

describe('SprintsController', () => {
  let sprintsController: SprintsController;
  let sprintsService: SprintsService;

  const sprintsServiceMock = {
    getVoyagesAndSprints: jest.fn(),
    getSprintDatesByTeamId: jest.fn(),
    getMeetingById: jest.fn(),
    createTeamMeeting: jest.fn(),
  } as unknown as SprintsService;

  const mockCreateMeeetingDto: CreateTeamMeetingDto = {
    title: "Sprint Planning",
    description: "Planning session for sprint 1",
    meetingLink: "http://meet.google.com/123",
    dateTime: new Date(),
    notes: "Please come prepared",
  };

  const mockCreatedMeeting = {
    id: 1,
    sprintId: 1,
    createdAt: mockDate,
    updatedAt: mockDate,
    voyageTeamId: 1,
    ...mockCreateMeeetingDto
  }
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

  describe('getVoyagesAndSprints', () => {
    it('should return an array of voyages and sprints', async () => {
      const result = [
        {
          sprints: [
            {
              teamMeetings: [1, 2],
              number: 1,
              id: 1,
              startDate: new Date(),
              endDate: new Date(),
            },
          ],
          number: '1',
          id: 1,
          startDate: new Date(),
          endDate: new Date(),
          soloProjectDeadline: new Date(),
          certificateIssueDate: new Date(),
          showcasePublishDate: new Date(),
        },
      ];
      jest.spyOn(sprintsService, 'getVoyagesAndSprints').mockResolvedValue(result);

      expect(await sprintsController.getVoyagesAndSprints()).toEqual(result);
    });

    it('should throw UnauthorizedException if user is not logged in', async () => {
      jest.spyOn(sprintsService, 'getVoyagesAndSprints').mockRejectedValue(
        new UnauthorizedException('User is not logged in')
      );

      await expect(sprintsController.getVoyagesAndSprints())
        .rejects
        .toThrow(UnauthorizedException);
      expect(sprintsService.getVoyagesAndSprints).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSprintDatesByTeamId', () => {
    it('should return voyage and sprint data for a team', async () => {
      const result =
      {
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

      jest.spyOn(sprintsService, 'getSprintDatesByTeamId').mockResolvedValue(result);

      expect(await sprintsController.getSprintDatesByTeamId({} as any, 1)).toBe(result);
    });

    it('should throw NotFoundException if team ID is invalid', async () => {
      jest.spyOn(sprintsService, 'getSprintDatesByTeamId').mockRejectedValue(
        new NotFoundException('Team is not found')
      );

      await expect(sprintsController.getSprintDatesByTeamId({} as any, 999)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user lacks permission', async () => {
      jest.spyOn(sprintsService, 'getSprintDatesByTeamId').mockRejectedValue(
        new ForbiddenException('User does not have required permissions')
      );

      await expect(sprintsController.getSprintDatesByTeamId({} as any, 1)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getMeetingById', () => {
    const mockRequest = {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      }
    } as unknown as CustomRequest;

    const mockMeeting = createMockData.meeting(1, {
      sprint: createMockData.sprint(1, 1),
      agendas: [
        createMockData.agenda(1, {
          title: 'Agenda 1',
          description: 'Agenda 1 description',
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
      ]
    });

    it('should return meeting details successfully', async () => {
      jest.spyOn(sprintsService, 'getMeetingById').mockResolvedValue(mockMeeting);
      const meetingId = 1;
      const result = await sprintsController.getMeetingById(mockRequest, meetingId);

      expect(result).toEqual(mockMeeting);
      expect(sprintsService.getMeetingById).toHaveBeenCalledWith(meetingId, mockRequest);
    });

    it('should throw NotFoundException if meeting ID is invalid', async () => {
      const nonExistentMeetingId = 999;
      jest.spyOn(sprintsService, 'getMeetingById').mockRejectedValue(
        new NotFoundException(`Meeting with ${nonExistentMeetingId} not found`)
      );
      await expect(sprintsController.getMeetingById(mockRequest, nonExistentMeetingId))
        .rejects
        .toThrow(NotFoundException);
      expect(sprintsService.getMeetingById).toHaveBeenCalledWith(nonExistentMeetingId, mockRequest);
    });

    it('should throw UnauthorizedException if user is not logged in', async () => {
      jest.spyOn(sprintsService, 'getMeetingById').mockRejectedValue(
        new UnauthorizedException('User is not logged in')
      );

      await expect(sprintsController.getMeetingById(mockRequest, 1))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException if user lacks permission', async () => {
      jest.spyOn(sprintsService, 'getMeetingById').mockRejectedValue(
        new ForbiddenException('User does not have required permissions')
      );

      await expect(sprintsController.getMeetingById(mockRequest, 1))
        .rejects
        .toThrow(ForbiddenException);
    });

    it('should verify the meeting response structure', async () => {
      // Arrange
      jest.spyOn(sprintsService, 'getMeetingById').mockResolvedValue(mockMeeting);
      const meetingId = 1;

      // Act
      const result = await sprintsController.getMeetingById(mockRequest, meetingId);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('voyageTeamId');
      expect(result).toHaveProperty('sprint');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('dateTime');
      expect(result).toHaveProperty('meetingLink');
      expect(result).toHaveProperty('notes');
      expect(result).toHaveProperty('agendas');
      expect(result).toHaveProperty('formResponseMeeting');

      // Verify nested properties for sprint
      expect(result.sprint).toHaveProperty('id');
      expect(result.sprint).toHaveProperty('number');
      expect(result.sprint).toHaveProperty('startDate');
      expect(result.sprint).toHaveProperty('endDate');
      expect(result.sprint.startDate).toBeInstanceOf(Date);
      expect(result.sprint.endDate).toBeInstanceOf(Date);

      // Verify nested properties for agendas
      if (result.agendas.length > 0) {
        expect(result.agendas[0]).toHaveProperty('id');
        expect(result.agendas[0]).toHaveProperty('title');
        expect(result.agendas[0]).toHaveProperty('description');
        expect(result.agendas[0]).toHaveProperty('status');
        expect(result.agendas[0]).toHaveProperty('updatedAt');
        expect(result.agendas[0].updatedAt).toBeInstanceOf(Date);
      }
      // Verify nested properties for form Response
      if (result.formResponseMeeting.length > 0) {
        const formResponse = result.formResponseMeeting[0];
        expect(formResponse).toHaveProperty('id');
        expect(formResponse.form).toHaveProperty('title');
        expect(formResponse.responseGroup?.responses[0].question).toHaveProperty('text')
      }
    });
    it('should return meeting with empty agendas', async () => {
      // Arrange
      const meetingWithoutAgendas = { ...mockMeeting, agendas: [] };
      jest.spyOn(sprintsService, 'getMeetingById').mockResolvedValue(meetingWithoutAgendas);

      // Act
      const result = await sprintsController.getMeetingById(mockRequest, 1);

      // Assert
      expect(result.agendas).toEqual([]);
      expect(sprintsService.getMeetingById).toHaveBeenCalledWith(1, mockRequest);
    });

    it('should return meeting with empty form responses', async () => {
      // Arrange
      const meetingWithoutForms = { ...mockMeeting, formResponseMeeting: [] };
      jest.spyOn(sprintsService, 'getMeetingById').mockResolvedValue(meetingWithoutForms);

      // Act
      const result = await sprintsController.getMeetingById(mockRequest, 1);

      // Assert
      expect(result.formResponseMeeting).toEqual([]);
      expect(sprintsService.getMeetingById).toHaveBeenCalledWith(1, mockRequest);
    });
  })

  describe('createTeamMeeting', () => {
    const teamId = 1;
    const sprintNumber = 1;

    it('should create a team meeting successfully', async () => {
      // Arrange
      jest.spyOn(sprintsService, 'createTeamMeeting').mockResolvedValue(mockCreatedMeeting);
      // Act
      const result = await sprintsController.createTeamMeeting(createMockData.request, teamId, sprintNumber, mockCreateMeeetingDto);

      // Assert
      expect(result).toEqual(mockCreatedMeeting);
      expect(sprintsService.createTeamMeeting).toHaveBeenCalledWith(teamId, sprintNumber, mockCreateMeeetingDto, createMockData.request);
    });
    it('should throw NotFoundException when sprint does not exist', async () => {
      // Arrange
      jest.spyOn(sprintsService, 'createTeamMeeting').mockRejectedValue(
        new NotFoundException(`Sprint number ${sprintNumber} or team Id ${teamId} does not exist.`)
      );

      // Act & Assert
      await expect(
        sprintsController.createTeamMeeting(createMockData.request, sprintNumber, teamId, mockCreateMeeetingDto)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when meeting already exists for sprint', async () => {
      // Arrange
      jest.spyOn(sprintsService, 'createTeamMeeting').mockRejectedValue(
        new ConflictException('A meeting already exist for this sprint.')
      );

      // Act & Assert
      await expect(
        sprintsController.createTeamMeeting(createMockData.request, sprintNumber, teamId, mockCreateMeeetingDto)
      ).rejects.toThrow(ConflictException);
    });

    it('should throw UnauthorizedException when user is not logged in', async () => {
      // Arrange
      jest.spyOn(sprintsService, 'createTeamMeeting').mockRejectedValue(
        new UnauthorizedException('User is not logged in')
      );

      // Act & Assert
      await expect(
        sprintsController.createTeamMeeting(createMockData.request, sprintNumber, teamId, mockCreateMeeetingDto)
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException when user lacks permission', async () => {
      // Arrange
      jest.spyOn(sprintsService, 'createTeamMeeting').mockRejectedValue(
        new ForbiddenException('User does not have required permissions')
      );

      // Act & Assert
      await expect(
        sprintsController.createTeamMeeting(createMockData.request, sprintNumber, teamId, mockCreateMeeetingDto)
      ).rejects.toThrow(ForbiddenException);
    });


    it('should verify created meeting data structure', async () => {
      // Arrange
      jest.spyOn(sprintsService, 'createTeamMeeting').mockResolvedValue(mockCreatedMeeting);

      // Act
      const result = await sprintsController.createTeamMeeting(
        createMockData.request,
        sprintNumber,
        teamId,
        mockCreateMeeetingDto
      );

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('sprintId');
      expect(result).toHaveProperty('voyageTeamId');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('meetingLink');
      expect(result).toHaveProperty('dateTime');
      expect(result).toHaveProperty('notes');
      expect(result.dateTime).toBeInstanceOf(Date);
    });

    it('should handle optional fields in creation dto', async () => {
      // Arrange
      const dtoWithOptionalFields = {
        title: 'Required Title',
        dateTime: new Date(),
        meetingLink: 'https://meet.test.com',
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

      jest.spyOn(sprintsService, 'createTeamMeeting').mockResolvedValue(meetingWithOptionalFields);

      // Act
      const result = await sprintsController.createTeamMeeting(
        createMockData.request,
        sprintNumber,
        teamId,
        dtoWithOptionalFields
      );

      // Assert
      expect(result.description).toBeNull();
      expect(result.notes).toBeNull();
      expect(sprintsService.createTeamMeeting).toHaveBeenCalledWith(
        teamId,
        sprintNumber,
        dtoWithOptionalFields,
        createMockData.request
      );
    });
  })

  // Add more tests for other methods similarly...
});
