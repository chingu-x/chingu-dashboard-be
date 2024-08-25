import { populateCheckinForm } from "./checkinform";
import { populateMeetingForms } from "./meeting-forms";
import { populateCheckinFormSM } from "./checkinformSM";
import { populateCheckinFormPO } from "./checkinformPO";
import { populateSoloProjectForm } from "./solo-project";
import { populateVoyageApplicationForm } from "./voyage-app";
import { populateVoyageSubmissionForm } from "./voyage-project-submission";
import { prisma } from "../prisma-client";
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

    // Sprints checkin form
    await populateMeetingForms();
    await populateCheckinForm();
    await populateCheckinFormPO();
    await populateCheckinFormSM();
    await populateCheckinFormResponse();
    await populateSoloProjectForm();
    await populateVoyageApplicationForm();
    await populateVoyageSubmissionForm();
    await populateVoyageProjectSubmissionFormResponses();

    console.log("Forms, Questions and Responses populated.");
};
