import { prisma } from "../prisma-client";
import { FormTitles } from "../../../src/global/constants/formTitles";
import { getQuestionsByFormTitle, populateQuestionResponses } from "./helper";

export const populateVoyageProjectSubmissionFormResponses = async () => {
    const voyageTeamId = 1; //hardcoded voyage team Id

    const questions = await getQuestionsByFormTitle(
        FormTitles.voyageProjectSubmission,
    );

    const responseGroup = await prisma.responseGroup.create({
        data: {},
    });

    await Promise.all(
        questions.map((question) => {
            populateQuestionResponses(question, responseGroup.id);
        }),
    );

    await prisma.formResponseVoyageProject.create({
        data: {
            voyageTeamId: voyageTeamId,
            responseGroupId: responseGroup.id,
        },
    });
};
