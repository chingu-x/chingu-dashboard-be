import { SprintsController } from "./sprints.controller";
import { SprintsService } from "./sprints.service";
import { mockDate } from "./mock-data";
import { CustomRequest } from "@/global/types/CustomRequest";
import { UnauthorizedException, ForbiddenException, NotFoundException } from "@nestjs/common";

describe("SprintsController", () => {
  let controller: SprintsController;
  let sprintsService: SprintsService;

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  const mockRequest = {
    user: mockUser
  } as unknown as CustomRequest;

  const mockTeamSprints = {
    id: 1,
    number: 46,
    startDate: mockDate,
    endDate: mockDate,
    sprints: [
      {
        id: 1,
        number: 1,
        startDate: mockDate,
        endDate: mockDate,
        teamMeetings: [1, 2]
      }
    ]
  };

  beforeAll(() => {
    sprintsService = {
      getSprintDatesByTeamId: jest.fn(),
    } as unknown as SprintsService;

    controller = new SprintsController(sprintsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSprintDatesByTeamId", () => {
    const teamId = 1;

    it("should get sprint dates successfully", async () => {
      (sprintsService.getSprintDatesByTeamId as jest.Mock).mockResolvedValue(mockTeamSprints);

      const result = await controller.getSprintDatesByTeamId(mockRequest, teamId);

      expect(result).toEqual(mockTeamSprints);
      expect(sprintsService.getSprintDatesByTeamId).toHaveBeenCalledWith(teamId, mockRequest);
    });

    it("should throw NotFoundException for invalid team", async () => {
      (sprintsService.getSprintDatesByTeamId as jest.Mock).mockRejectedValue(
        new NotFoundException(`Invalid teamId: ${teamId}`)
      );

      await expect(controller.getSprintDatesByTeamId(mockRequest, teamId))
        .rejects
        .toThrow(NotFoundException);
    });

    it("should throw UnauthorizedException for unauthorized access", async () => {
      (sprintsService.getSprintDatesByTeamId as jest.Mock).mockRejectedValue(
        new UnauthorizedException()
      );

      await expect(controller.getSprintDatesByTeamId(mockRequest, teamId))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it("should throw ForbiddenException for insufficient permissions", async () => {
      (sprintsService.getSprintDatesByTeamId as jest.Mock).mockRejectedValue(
        new ForbiddenException()
      );

      await expect(controller.getSprintDatesByTeamId(mockRequest, teamId))
        .rejects
        .toThrow(ForbiddenException);
    });
  });
});