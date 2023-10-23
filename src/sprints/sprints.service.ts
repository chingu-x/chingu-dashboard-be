import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import {PrismaService} from "../prisma/prisma.service";
import {CreateTeamMeetingDto} from "./dto/create-team-meeting-dto";

@Injectable()
export class SprintsService {
  constructor(private prisma: PrismaService) {}

  findSprintIdBySprintNumber = async (
      teamId: number,
      sprintNumber: number,
  ): Promise<number> | null => {
    const sprintsByTeamId = await this.prisma.voyageTeam.findUnique({
      where: {
        id: teamId
      },
      include: {
        voyage: {
          include: {
            sprints: {
              select: {
                id: true,
                number: true
              }
            }
          }
        }
      }
    })
    return sprintsByTeamId?.voyage?.sprints?.filter(s=>s.number===sprintNumber)[0].id
  }

  async createTeamMeeting(
      teamId: number,
      sprintNumber: number,
      {title, meetingLink, dateTime, notes}: CreateTeamMeetingDto
  ) {
    const sprintId = await this.findSprintIdBySprintNumber(teamId,sprintNumber)
    if(!sprintId) {
      throw new NotFoundException(`Sprint Id not found for team ${teamId} for sprint number ${sprintNumber}.`)
    }

    // check if the sprint already has a meeting.
    // This is temporary just remove this block when the app supports multiple meeting per sprint
    const isMeetingExist = await this.prisma.teamMeeting.findFirst({
      where:{
        sprintId: sprintId
      }
    })

    if (isMeetingExist)
      throw new ConflictException(`A meeting already exist for this sprint.`)
    // - End of temporary block

    return this.prisma.teamMeeting.create({
      data: {
        sprintId,
        voyageTeamId: teamId,
        title,
        meetingLink,
        dateTime,
        notes
      }
    })
  }

  findAll() {
    return `This action returns all sprints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sprint`;
  }

  update(id: number, updateSprintDto: UpdateSprintDto) {
    return `This action updates a #${id} sprint`;
  }

  remove(id: number) {
    return `This action removes a #${id} sprint`;
  }
}
