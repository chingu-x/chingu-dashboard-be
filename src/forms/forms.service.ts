import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FormsService {
    constructor(private prisma: PrismaService) {}

    getAllForms() {
        return this.prisma.form.findMany({});
    }

    async getFormById(formId: number) {
        const form = await this.prisma.form.findUnique({
            where: {
                id: formId,
            },
            select: {
                id: true,
                formType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                title: true,
                description: true,
                questions: true,
            },
        });
        if (!form)
            throw new NotFoundException(
                `Invalid formId: Form (id:${formId}) does not exist.`,
            );
        return form;
    }
}
