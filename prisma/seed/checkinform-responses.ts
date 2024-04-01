import { formSelect } from "../../src/forms/forms.service";
import { prisma } from "./prisma-client";

// TODO: move these to a  helper function file
const getRandomOptionId = async (
    optionGroupId: number,
    numberOfChoices: number,
) => {
    const choicesArray = [];
    const choices = await prisma.optionChoice.findMany({
        where: {
            optionGroupId,
        },
    });
    while (choicesArray.length < numberOfChoices) {
        const choice = choices[Math.floor(Math.random() * choices.length)].id;
        if (!choicesArray.includes(choice)) {
            choicesArray.push(choice);
        }
    }
    return choicesArray;
};

const getTeamMembers = async (teamMemberId: number) => {
    const team = await prisma.voyageTeam.findFirst({
        where: {
            voyageTeamMembers: {
                some: {
                    id: teamMemberId,
                },
            },
        },
        select: {
            voyageTeamMembers: {
                select: {
                    member: {
                        select: {
                            discordId: true,
                        },
                    },
                },
            },
        },
    });
    return team.voyageTeamMembers.map((m) => m.member.discordId);
};

const populateQuestionResponses = async (
    question: any,
    teamMemberId: number,
    responseGroupId: number,
) => {
    const data: any = {
        questionId: question.id,
        responseGroupId: responseGroupId,
    };
    switch (question.inputType.name) {
        case "text": {
            await prisma.response.create({
                data: {
                    ...data,
                    text: `Text response for Question id ${question.id}.`,
                },
            });
            break;
        }
        case "radio": {
            const radioChoices = await getRandomOptionId(
                question.optionGroupId,
                1,
            );
            await prisma.response.create({
                data: {
                    ...data,
                    optionChoiceId: radioChoices[0],
                },
            });
            break;
        }
        case "radioGroup": {
            // get all subquestions
            const subQuestions = await prisma.question.findMany({
                where: {
                    parentQuestionId: question.id,
                },
                select: {
                    id: true,
                    inputType: {
                        select: {
                            name: true,
                        },
                    },
                    optionGroupId: true,
                },
            });
            // popuate all subquestions
            await Promise.all(
                subQuestions.map((subq) => {
                    // assign subquestion optionGroupId to be same as parent, as it's null for subquestions
                    subq.optionGroupId = question.optionGroupId;
                    populateQuestionResponses(
                        subq,
                        teamMemberId,
                        responseGroupId,
                    );
                }),
            );
            break;
        }
        case "checkbox": {
            // check 2 randomly,
            // 2 response entries as scalar list or optional list is not supported for relations
            const checkboxChoices = await getRandomOptionId(
                question.optionGroupId,
                2,
            );

            await prisma.response.createMany({
                data: [
                    {
                        ...data,
                        optionChoiceId: checkboxChoices[0],
                    },
                    {
                        ...data,
                        optionChoiceId: checkboxChoices[1],
                    },
                ],
            });
            break;
        }
        case "teamMembersCheckbox": {
            const selectedTeamMembers = await getTeamMembers(teamMemberId);
            await prisma.response.create({
                data: {
                    ...data,
                    text: selectedTeamMembers
                        .filter((m) => m !== null)
                        .join(";"),
                },
            });
            break;
        }
        case "number": {
            await prisma.response.create({
                data: {
                    ...data,
                    numeric: Math.floor(Math.random() * 100),
                },
            });
            break;
        }
        case "yesNo": {
            await prisma.response.create({
                data: {
                    ...data,
                    boolean: Math.random() > 0.5,
                },
            });
            break;
        }
        default: {
            throw new Error("Prisma seed: Unexpected question type");
        }
    }
};

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
            populateQuestionResponses(question, teamMemberId, responseGroup.id);
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
