import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import Genders from "./data/genders";
import Tiers from "./data/tiers";
import VoyageRoles from "./data/voyage-roles";
import VoyageStatus from "./data/voyage-status";
import TechStackCategories from "./data/tech-stack-categories";

import Voyages from "./data/voyages";
import FeatureCategories from "./data/feature-categories";

import FormTypes from "./data/form-types"
import InputTypes from "./data/input-types"
import OptionGroups from "./data/option-groups"

const populateTable = async (tableName: string, data) => {
    await Promise.all(
        data.map((row) =>
            prisma[tableName].create({
                data: row,
            }),
        ),
    );
    console.log(`${tableName} table populated.`);
};

export const populateTables = async () => {
    await populateTable("tier", Tiers);
    await populateTable("gender", Genders);
    await populateTable("voyageRole", VoyageRoles);
    await populateTable("voyageStatus", VoyageStatus);
    await populateTable("techStackCategory", TechStackCategories);
    await populateTable("voyage", Voyages);
    await populateTable("featureCategory", FeatureCategories);
    await populateTable("formType", FormTypes);
    await populateTable("inputType", InputTypes);
    await populateTable("optionGroup", OptionGroups)
};
