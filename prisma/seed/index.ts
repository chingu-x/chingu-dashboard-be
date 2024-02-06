import { PrismaClient } from "@prisma/client";
import * as process from "process";
import { populateTeamResourcesAndProjectIdeas } from "./resources-project-ideas";
import { populateTables } from "./tables";
import { populateFormsAndResponses } from "./forms";
import { populateVoyageTeams } from "./voyage-teams";
import { populateUsers } from "./users";
import { populateSprints } from "./sprints";
import { populateMeetings } from "./meetings";
import { populateSoloProjects } from "./solo-project";
import { populateVoyageApplications } from "./voyage-app";
import { populateChecklists } from "./checklist";
import { populateVoyages } from "./voyage";

const prisma = new PrismaClient();

const deleteAllTables = async () => {
    const tablenames = await prisma.$queryRaw<
        Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tablenames
        .map(({ tablename }) => tablename)
        .filter((name) => name !== "_prisma_migrations")
        .map((name) => `"public"."${name}"`)
        .join(", ");

    try {
        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE;`,
        );
    } catch (error) {
        console.log({ error });
    }
    console.log("===\nAll tables deleted.\n===");
};

export const seed = async () => {
    await deleteAllTables();
    await populateTables(); // tables with no relations
    await populateVoyages();
    await populateUsers();
    await populateSprints();
    await populateVoyageTeams();
    await populateTeamResourcesAndProjectIdeas();
    await populateFormsAndResponses();
    await populateMeetings();
    await populateSoloProjects();
    await populateVoyageApplications();
    await populateChecklists();
    console.log("===\n🌱 Database seeding completed.\n===");
};

(async function () {
    try {
        await seed();
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
})();
