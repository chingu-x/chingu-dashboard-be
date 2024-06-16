import { populateCheckinForm } from "./checkinform";
import { populateSoloProjectForm } from "./solo-project";
import { populateVoyageApplicationForm } from "./voyage-app";
import { populateVoyageSubmissionForm } from "./voyage-project-submission";
import { prisma } from "../prisma-client";
import { FormTitles } from "../../../src/global/constants/formTitles";
import { populateCheckinFormResponse } from "../responses/checkinform-responses";
import { populateVoyageProjectSubmissionFormResponses } from "../responses/voyage-project-form-response";

export const populateFormsAndResponses = async () => {
    // test option choices for Voyage Application form
    // TODO: maybe move these to somewhere else (I don't think these are currently in use)
    await prisma.optionChoice.create({
        data: {
            optionGroup: {
                connect: {
                    name: "voyage roles",
                },
            },
            text: "Developer",
        },
    });
    await prisma.optionChoice.create({
        data: {
            optionGroup: {
                connect: {
                    name: "voyage roles",
                },
            },
            text: "Product Owner",
        },
    });
    await prisma.optionChoice.create({
        data: {
            optionGroup: {
                connect: {
                    name: "voyage roles",
                },
            },
            text: "Designer",
        },
    });
    await prisma.optionChoice.create({
        data: {
            optionGroup: {
                connect: {
                    name: "voyage roles",
                },
            },
            text: "Voyage Guide",
        },
    });

    // Sprint - Retrospective and review form
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "meeting",
                },
            },
            title: FormTitles.sprintRetroAndReview,
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "What went right?",
                        description: "Share your thoughts on what went right",
                        answerRequired: false,
                    },
                    {
                        order: 2,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "What could be improved?",
                        description:
                            "Share your thoughts on what could be improved for the next sprint",
                        answerRequired: false,
                    },
                    {
                        order: 3,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Changes to be made for the next sprint?",
                        description:
                            "Share your thoughts on what could be changed for the next sprint",
                        answerRequired: false,
                    },
                ],
            },
        },
    });

    // Sprint - Sprint Planning form
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "meeting",
                },
            },
            title: FormTitles.sprintPlanning,
            questions: {
                create: [
                    {
                        order: 1,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Sprint Goal",
                        description:
                            "What is the primary goal of the next sprint?",
                        answerRequired: false,
                    },
                    {
                        order: 2,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Timeline/Tasks",
                        description:
                            "What are some of the goals we want to achieve",
                        answerRequired: false,
                    },
                ],
            },
        },
    });

    // Sprints checkin form
    await populateCheckinForm();
    await populateCheckinFormResponse();
    await populateSoloProjectForm();
    await populateVoyageApplicationForm();
    await populateVoyageSubmissionForm();
    await populateVoyageProjectSubmissionFormResponses();

    console.log("Forms, Questions and Responses populated.");
};
