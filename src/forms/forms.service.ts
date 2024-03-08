import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

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
        },
    },
} as Prisma.FormSelect;

@Injectable()
export class FormsService {
    constructor(private prisma: PrismaService) {}

    async getAllForms() {
        const data = await this.prisma.form.findMany({
            select: formSelect,
        });

        const dataToReturn = data.map(({ questions, ...i }) => ({
            ...i,
            subQuestions: questions,
        }));

        return dataToReturn;
    }

    async getFormById(formId: number) {
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

        const { questions, ...rest } = form;
        const data = {
            ...rest,
            subQuestions: questions,
        };
        return data;
    }
}
