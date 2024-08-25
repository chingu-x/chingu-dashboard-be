import { populateMeetingForms } from "../seed/forms/meeting-forms";
import { populateCheckinForm } from "../seed/forms/checkinform";
import { populateCheckinFormPO } from "../seed/forms/checkinformPO";
import { populateCheckinFormSM } from "../seed/forms/checkinformSM";
import { populateVoyageSubmissionForm } from "../seed/forms/voyage-project-submission";

export const populateFormsProd = async () => {
    await populateMeetingForms();
    await populateCheckinForm();
    await populateCheckinFormPO();
    await populateCheckinFormSM();
    await populateVoyageSubmissionForm();

    console.log("[Prod] Forms table populated.");
};
