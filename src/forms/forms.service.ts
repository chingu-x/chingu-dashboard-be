import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const formSelect = {
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
};

@Injectable()
export class FormsService {
    constructor(private prisma: PrismaService) {}

    getAllForms() {
        return this.prisma.form.findMany({
            select: formSelect,
        });
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
        return form;
    }
}
