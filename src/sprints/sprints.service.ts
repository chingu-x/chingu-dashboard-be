import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {UpdateTeamMeetingDto} from './dto/update-team-meeting.dto';
import {PrismaService} from "../prisma/prisma.service";
import {CreateTeamMeetingDto} from "./dto/create-team-meeting.dto";
import {CreateAgendaDto} from "./dto/create-agenda.dto";
import {UpdateAgendaDto} from "./dto/update-agenda.dto";

@Injectable()
export class SprintsService {
    constructor(private prisma: PrismaService) {
    }

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
        return sprintsByTeamId?.voyage?.sprints?.filter(s => s.number === sprintNumber)[0].id
    }

    async createTeamMeeting(
        teamId: number,
        sprintNumber: number,
        {title, meetingLink, dateTime, notes}: CreateTeamMeetingDto
    ) {
        const sprintId = await this.findSprintIdBySprintNumber(teamId, sprintNumber)
        if (!sprintId) {
            throw new NotFoundException(`Sprint Id not found for team ${teamId} for sprint number ${sprintNumber}.`)
        }

        // check if the sprint already has a meeting.
        // This is temporary just remove this block when the app supports multiple meeting per sprint
        const isMeetingExist = await this.prisma.teamMeeting.findFirst({
            where: {
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

    async updateTeamMeeting(
        meetingId: number,
        {title, meetingLink, dateTime, notes}: UpdateTeamMeetingDto
    ) {
        try {
            const updatedMeeting = await this.prisma.teamMeeting.update({
                where: {
                    id: meetingId
                },
                data: {
                    title,
                    meetingLink,
                    dateTime,
                    notes,
                }
            })
            return updatedMeeting
        } catch (e) {
            if (e.code === 'P2025') {
                throw new NotFoundException(
                    `Invalid meetingId: ${meetingId}`
                )
            }
        }

    }

    async createMeetingAgenda(
        meetingId: number,
        {title, description, status}: CreateAgendaDto
    ) {
        try {
            const newAgenda = await this.prisma.agenda.create({
                data: {
                    teamMeetingId: meetingId,
                    title,
                    description,
                    status
                }
            })
            return newAgenda
        } catch (e) {
            if (e.code === 'P2003') {
                throw new BadRequestException(
                    `Invalid meetingId: ${meetingId}`
                )
            }
        }
    }

    async updateMeetingAgenda(
        agendaId: number,
        {title, description, status}: UpdateAgendaDto
    ) {
        try {
            const updatedMeeting = await this.prisma.agenda.update({
                where: {
                    id: agendaId
                },
                data: {
                    title,
                    description,
                    status
                }
            })
            return updatedMeeting
        } catch (e) {
            if (e.code === 'P2025') {
                throw new NotFoundException(
                    `Invalid meetingId: ${agendaId}`
                )
            }
        }
    }
}
