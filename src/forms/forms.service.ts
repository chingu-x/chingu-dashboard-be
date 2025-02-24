import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { Form, Prisma, Question } from "@prisma/client";
import { canReadAndSubmitForms } from "@/ability/conditions/forms.ability";
import { CustomRequest } from "@/global/types/CustomRequest";

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
            parseConfig: true,
            optionGroup: {
                select: {
                    optionChoices: {
                        select: {
                            id: true,
                            text: true,
                            parseConfig: true,
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
                    parseConfig: true,
                    optionGroup: {
                        select: {
                            optionChoices: {
                                select: {
                                    id: true,
                                    text: true,
                                    parseConfig: true,
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
} satisfies Prisma.FormSelect;

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
                const currentQuestion = question as unknown as Question & {
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
            ...(form as unknown as Form),
            formTypeId: form.formType.id,
        });

        const subQuestionsIds: number[] = [];

        form.questions.forEach((question) => {
            const currentQuestion = question as unknown as Question & {
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
