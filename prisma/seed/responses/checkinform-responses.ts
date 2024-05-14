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
};
