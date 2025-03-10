// TODO: this is incomplete. just added some fields for testing
import { prisma } from "../prisma-client";
import { FormTitles } from "../../../src/global/constants/formTitles";
export const populateVoyageApplicationForm = async () => {
    // Get input type IDs first
    const radioInputType = await prisma.inputType.findUnique({
        where: { name: "radio" },
    });

    const textInputType = await prisma.inputType.findUnique({
        where: { name: "text" },
    });

    const noInputTextType = await prisma.inputType.findUnique({
        where: { name: "noInputText" },
    });

    if (!radioInputType || !textInputType || !noInputTextType) {
        throw new Error("Required input types not found");
    }

    // Create option groups first
    const roleOptionGroup = await prisma.optionGroup.create({
        data: {
            name: "role",
            optionChoices: {
                create: [
                    { text: "developer" },
                    { text: "ui/ux designer" },
                    { text: "product owner" },
                ],
            },
        },
    });

    const tierOptionGroup = await prisma.optionGroup.create({
        data: {
            name: "tier",
            optionChoices: {
                create: [
                    { text: "Tier 1" },
                    { text: "Tier 2" },
                    { text: "Tier 3" },
                ],
            },
        },
    });

    const backendExpOptionGroup = await prisma.optionGroup.create({
        data: {
            name: "backend-experience",
            optionChoices: {
                create: [
                    {
                        text: "{{icon: checkIcon}} Yes",
                        parseConfig: {
                            icon: "checkIcon",
                        },
                    },
                    {
                        text: "{{icon: crossIcon}} No",
                        parseConfig: {
                            icon: "crossIcon",
                        },
                    },
                    {
                        text: "{{icon: pencilIcon}} Other (please specify)",
                        parseConfig: {
                            icon: "pencilIcon",
                            followup: true,
                        },
                    },
                ],
            },
        },
    });

    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "user",
                },
            },
            title: FormTitles.voyageApplication,
            questions: {
                create: [
                    {
                        order: 1,
                        inputTypeId: radioInputType.id,
                        text: "Role",
                        optionGroupId: roleOptionGroup.id,
                        answerRequired: true,
                    },
                    {
                        order: 2,
                        inputTypeId: radioInputType.id,
                        text: "Tier",
                        optionGroupId: tierOptionGroup.id,
                        answerRequired: true,
                    },
                    {
                        order: 3,
                        inputTypeId: textInputType.id,
                        text: "{{icon: codeIcon}} What programming languages are you most comfortable with?",
                        parseConfig: {
                            icon: "codeIcon",
                        },
                        answerRequired: true,
                    },
                    {
                        order: 4,
                        inputTypeId: radioInputType.id,
                        text: "{{hidden-role: [3, 4]}} Do you have experience with backend development?",
                        parseConfig: {
                            "hidden-role": [3, 4], // Hide for Product Owner (3) and UI/UX Designer (4)
                        },
                        optionGroupId: backendExpOptionGroup.id,
                        answerRequired: true,
                    },
                    {
                        order: 5,
                        inputTypeId: noInputTextType.id,
                        text: "{{applicableForRoles: [1, 2]}} Developer Section",
                        parseConfig: {
                            applicableForRoles: [1, 2], // Only show for Developer (1) and Data Scientist (2)
                        },
                        answerRequired: false,
                    },
                ],
            },
        },
    });
};
