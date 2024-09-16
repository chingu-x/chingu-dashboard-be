import Genders from "./data/genders";
import Tiers from "./data/tiers";
import VoyageRoles from "./data/voyage-roles";
import VoyageStatus from "./data/voyage-status";
import TechStackCategories from "./data/tech-stack-categories";

import FeatureCategories from "./data/feature-categories";

import FormTypes from "./data/form-types";
import InputTypes from "./data/input-types";
import OptionGroups from "./data/option-groups";
import Roles from "./data/roles";
import { prisma } from "./prisma-client";
import OauthProviders from "./data/oauth-providers";

const populateTable = async (tableName: string, data) => {
    await prisma[tableName].createMany({
        data,
    });
    console.log(`${tableName} table populated.`);
};

// These are basic data table that will be used in both dev and prod
export const populateTables = async () => {
    await populateTable("tier", Tiers);
    await populateTable("gender", Genders);
    await populateTable("role", Roles);
    await populateTable("voyageRole", VoyageRoles);
    await populateTable("voyageStatus", VoyageStatus);
    await populateTable("techStackCategory", TechStackCategories);
    await populateTable("featureCategory", FeatureCategories);
    await populateTable("formType", FormTypes);
    await populateTable("inputType", InputTypes);
    await populateTable("optionGroup", OptionGroups);
    await populateTable("oAuthProvider", OauthProviders);
};
