// TODO: this is incomplete. just added some fields for testing
import { prisma } from "../prisma-client";

export const populateVoyageApplicationForm = async () => {
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "user",
                },
            },
            title: "Voyage Application Form",
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: "radio",
                            },
                        },
                        text: "Role",
                        optionGroup: {
                            create: {
                                name: "role",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            { text: "developer" },
                                            { text: "ui/ux designer" },
                                            { text: "product owner" },
                                        ],
                                    },
                                },
                            },
                        },
                        answerRequired: true,
                    },
                    {
                        order: 2,
                        inputType: {
                            connect: {
                                name: "radio",
                            },
                        },
                        text: "Tier",
                        optionGroup: {
                            create: {
                                name: "tier",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            { text: "Tier 1" },
                                            { text: "Tier 2" },
                                            { text: "Tier 3" },
                                        ],
                                    },
                                },
                            },
                        },
                        answerRequired: true,
                    },
                ],
            },
        },
    });
};
