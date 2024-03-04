import { PrismaClient } from "@prisma/client";
import { formSelect } from "../../src/forms/forms.service";

const prisma = new PrismaClient();

export const populateCheckinFormResponse = async () => {
    const teamMember = await prisma.voyageTeamMember.findUnique({
        where: {
            id: 1,
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
        },
    });

    // get questions
    const questions = await prisma.form.findUnique({
        where: {
            title: "Sprint Check-in",
        },
        select: formSelect,
    });

    const responseGroup = await prisma.responseGroup.create({
        data: {
            responses: {
                createMany: {
                    data: [
                        {
                            questionId: questions[0],
                            //optionChoiceId: questions[0],
                        },
                    ],
                },
            },
        },
    });
    await prisma.formResponseCheckin.create({
        data: {
            voyageTeamMemberId: teamMember.id,
            sprintId: teamMember.voyageTeam.voyage.sprints[0].id,
            responseGroupId: responseGroup.id,
        },
    });
};
