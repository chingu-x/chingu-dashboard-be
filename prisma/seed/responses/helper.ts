import { prisma } from "../prisma-client";
import { formSelect } from "../../../src/forms/forms.service";

/*
generates a random option IDs (in an array) given an option group id

params:
numberOfChoices - size of the returned array
 */
const getRandomOptionId = async (
    optionGroupId: number,
    numberOfChoices: number,
) => {
    const choicesArray: number[] = [];
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

/*
gets all members in the voyage member with the given teamMemberId
this is used for input type "TeamMemberCheckboxes"
*/
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
                            oAuthProfiles: {
                                select: {
                                    provider: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                    providerUsername: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    return team!.voyageTeamMembers.map(
        (m) =>
            m.member.oAuthProfiles.find(
                (profile) => profile.provider.name === "discord",
            )?.providerUsername,
    );
};

/*
populates responses for a given question

params:
question - question (which includes id, inputType, etc)
responseGroupId - this is the group where all the responses for this particular submission are linked to
teamMemberId - optional, defaulted to 0, only used for teamMember inputType
*/
export const populateQuestionResponses = async (
    question: any,
    responseGroupId: number,
    teamMemberId: number = 0, // this is only used if it's a teamMember type input
) => {
    const data: any = {
        questionId: question.id,
        responseGroupId: responseGroupId,
    };
    switch (question.inputType.name) {
        case "text":
        case "shortText": {
            await prisma.response.create({
                data: {
                    ...data,
                    text: `Text response for Question id ${question.id}.`,
                },
            });
            break;
        }
        case "scale":
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
            // populate all subquestions
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
            if (teamMemberId === 0) {
                throw new Error(
                    `teamMemberId required for input type ${question.inputType.name} (question id:${question.id}).`,
                );
            }

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
        case "boolean": {
            await prisma.response.create({
                data: {
                    ...data,
                    boolean: Math.random() > 0.5,
                },
            });
            break;
        }
        case "url": {
            await prisma.response.create({
                data: {
                    ...data,
                    text: `https://www.randomUrl${question.id}.com`,
                },
            });
            break;
        }
        default: {
            throw new Error("Prisma seed: Unexpected question type");
        }
    }
};

export const getQuestionsByFormTitle = async (formTitle: string) => {
    const checkinForm = await prisma.form.findUnique({
        where: {
            title: formTitle,
        },
        select: formSelect,
    });

    return prisma.question.findMany({
        where: {
            formId: checkinForm!.id,
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
};
