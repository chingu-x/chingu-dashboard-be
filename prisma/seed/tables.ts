import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const Genders = require("./data/genders");
const Tiers = require("./data/tiers");
const VoyageRoles = require("./data/voyage-roles");
const VoyageStatus = require("./data/voyage-status");
const TechStackCategories = require("./data/tech-stack-categories");

const Users = require("./data/users");
const Voyages = require("./data/voyages");
const VoyageTeams = require("./data/voyage-teams");
const VoyageTeamMembers = require("./data/voyage-team-members");
const TechStackItems = require("./data/tech-stack-items");
const TeamTechStackItems = require("./data/team-tech-stack-items");

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
    await populateTable("user", Users);
    await populateTable("voyage", Voyages);
    await populateTable("voyageTeam", VoyageTeams);
    await populateTable("voyageTeamMember", VoyageTeamMembers);
    await populateTable("techStackItem", TechStackItems);
    await populateTable("teamTechStackItem", TeamTechStackItems);
};
