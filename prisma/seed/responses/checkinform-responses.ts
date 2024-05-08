import { prisma } from "../prisma-client";
import { getQuestionsByFormTitle, populateQuestionResponses } from "./helper";
import { FormTitles } from "../../../src/global/constants/formTitles";

export const populateCheckinFormResponse = async () => {
    const teamMemberId = 1;
    const teamMember = await prisma.voyageTeamMember.findUnique({
        where: {
            id: teamMemberId,
        },
        select: {
            id: true,
            voyageTeam: {
                select: {
                    voyage: {
                        select: {
                            sprints: true,
                        },
                    },
                },
            },
            userId: true,
        },
    });

    // get questions
    const questions = await getQuestionsByFormTitle(FormTitles.sprintCheckin);

    const responseGroup = await prisma.responseGroup.create({
        data: {},
    });

    await Promise.all(
        questions.map((question) => {
            populateQuestionResponses(question, responseGroup.id, teamMemberId);
        }),
    );

    await prisma.formResponseCheckin.create({
        data: {
            voyageTeamMemberId: teamMember.id,
            sprintId: teamMember.voyageTeam.voyage.sprints[0].id,
            responseGroupId: responseGroup.id,
        },
    });

    // find voyageTeamMemberIds from user table
    const teamMemberIds: number[] = (
        await prisma.user.findUnique({
            where: {
                id: teamMember.userId,
            },
            select: {
                voyageTeamMembers: {
                    select: {
                        id: true,
                    },
                },
            },
        })
    ).voyageTeamMembers.map((teamMember) => teamMember.id);

    // get all the checkins for the user
    const sprintCheckinIds: number[] = (
        await Promise.all(
            teamMemberIds.map((teamMemberId: number) => {
                return prisma.formResponseCheckin.findMany({
                    where: {
                        voyageTeamMemberId: teamMemberId,
                    },
                    select: {
                        id: true,
                    },
                });
            }),
        )
    )
        .flat()
        .map((checkin) => checkin.id);

    // add the sprintCheckin to the user
    await prisma.user.update({
        where: {
            id: teamMember.userId,
        },
        data: {
            sprintCheckin: sprintCheckinIds,
        },
    });
};
