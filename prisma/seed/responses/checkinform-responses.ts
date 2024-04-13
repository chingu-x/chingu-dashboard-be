import { formSelect } from "../../../src/forms/forms.service";
import { prisma } from "../prisma-client";
import { populateQuestionResponses } from "./helper";

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
        },
    });

    // get questions
    const checkinForm = await prisma.form.findUnique({
        where: {
            title: "Sprint Check-in",
        },
        select: formSelect,
    });

    const questions = await prisma.question.findMany({
        where: {
            formId: checkinForm.id,
            parentQuestionId: null,
        },
        select: {
            id: true,
            order: true,
            inputType: {
                select: {
                    name: true,
                },
            },
            optionGroupId: true,
            parentQuestionId: true,
        },
        orderBy: {
            order: "asc",
        },
    });

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
