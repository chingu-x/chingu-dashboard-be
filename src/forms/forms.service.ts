import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, Question } from "@prisma/client";
import { canReadAndSubmitForms } from "../ability/conditions/forms.ability";
import { CustomRequest } from "../global/types/CustomRequest";

export const formSelect = {
    id: true,
    formType: {
        select: {
            id: true,
            name: true,
        },
    },
    title: true,
    description: true,
    questions: {
        orderBy: {
            order: "asc",
        },
        select: {
            id: true,
            order: true,
            inputType: {
                select: {
                    id: true,
                    name: true,
                },
            },
            text: true,
            description: true,
            answerRequired: true,
            multipleAllowed: true,
            optionGroup: {
                select: {
                    optionChoices: {
                        select: {
                            id: true,
                            text: true,
                        },
                    },
                },
            },
            subQuestions: {
                select: {
                    id: true,
                    order: true,
                    inputType: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    text: true,
                    description: true,
                    answerRequired: true,
                    multipleAllowed: true,
                    optionGroup: {
                        select: {
                            optionChoices: {
                                select: {
                                    id: true,
                                    text: true,
                                },
                            },
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            },
            createdAt: true,
            updatedAt: true,
        },
    },
} as Prisma.FormSelect;

@Injectable()
export class FormsService {
    constructor(private prisma: PrismaService) {}

    async getAllForms() {
        const forms = await this.prisma.form.findMany({
            select: formSelect,
        });

        const subQuestionsIds: number[] = [];

        forms.forEach((form) => {
            form.questions.forEach((question) => {
                const currentQuestion = question as Question & {
                    subQuestions: Question[];
                };
                currentQuestion.subQuestions.forEach((subQuestion) => {
                    subQuestionsIds.push(subQuestion.id);
                });
            });
        });

        for (let i = 0; i < forms.length; i++) {
            const form = forms[i];
            const filteredQuestions = form.questions.filter(
                (i) => !subQuestionsIds.includes(i.id),
            );

            form.questions = filteredQuestions;
        }

        return forms;
    }

    async getFormById(formId: number, req: CustomRequest) {
        const form = await this.prisma.form.findUnique({
            where: {
                id: formId,
            },
            select: formSelect,
        });

        if (!form)
            throw new NotFoundException(
                `Invalid formId: Form (id:${formId}) does not exist.`,
            );

        canReadAndSubmitForms(req.user, {
            ...form,
            formTypeId: form.formType.id,
        });

        const subQuestionsIds: number[] = [];

        form.questions.forEach((question) => {
            const currentQuestion = question as Question & {
                subQuestions: Question[];
            };
            currentQuestion.subQuestions.forEach((subQuestion) => {
                subQuestionsIds.push(subQuestion.id);
            });
        });

        const filteredQuestions = form.questions.filter(
            (i) => !subQuestionsIds.includes(i.id),
        );

        form.questions = filteredQuestions;

        return form;
    }
}
