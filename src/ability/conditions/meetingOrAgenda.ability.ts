import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { UserReq } from "../../global/types/CustomRequest";
import prisma from "../../prisma/client";
import { Agenda, TeamMeeting } from "@prisma/client";

export const manageOwnTeamMeetingOrAgendaById = async ({
    user,
    meetingId,
    agendaId,
}: {
    user: UserReq;
    meetingId?: number;
    agendaId?: number;
    subject?: TeamMeeting | Agenda; // If we want to extend some more permissions for any particular subject
}) => {
    let meetingOrAgendaTeamId: number;
    const voyagerTeamIds = user.voyageTeams.map((vt) => vt.teamId);
    if (meetingId) {
        const meeting = await prisma.teamMeeting.findUnique({
            where: {
                id: meetingId,
            },
            select: {
                voyageTeamId: true,
            },
        });
        if (!meeting) {
            throw new NotFoundException(
                `Team Meeting (id:${meetingId}) not found`,
            );
        }

        meetingOrAgendaTeamId = meeting.voyageTeamId;
    }

    if (agendaId) {
        const agenda = await prisma.agenda.findUnique({
            where: {
                id: agendaId,
            },
            select: {
                teamMeeting: {
                    select: {
                        voyageTeamId: true,
                    },
                },
            },
        });
        if (!agenda) {
            throw new NotFoundException(
                `Team Meeting Agenda (id:${agendaId}) not found`,
            );
        }

        meetingOrAgendaTeamId = agenda.teamMeeting.voyageTeamId;
    }

    if (!user.roles.includes("voyager") && !user.roles.includes("admin")) {
        throw new ForbiddenException(
            "Invalid user role for Sprint Meeting access control",
        );
    }

    if (user.roles.includes("admin")) return;

    if (!voyagerTeamIds.includes(meetingOrAgendaTeamId!)) {
        throw new ForbiddenException(
            "Sprint Meeting access control: You can only manage your own project features.",
        );
    }
};
