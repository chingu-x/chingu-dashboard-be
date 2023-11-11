import { PrismaClient } from "@prisma/client";
import * as process from "process";
import { populateTablesWithRelations } from "./relations";
import { populateTables } from "./tables";
import { populateFormsAndResponses } from "./forms";
import { populateVoyageTeams } from "./voyageTeams";
import { populateUsers } from "./users";
import { populateSprints } from "./sprints";
import { populateMeetings } from "./meetings";

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
            `TRUNCATE TABLE ${tables} CASCADE RESTART IDENTITY CASCADE;`,
        );
    } catch (error) {
        console.log({ error });
    }
    console.log("===\nAll tables deleted.\n===");
};

(async function () {
    try {
        await deleteAllTables();
        await populateTables();
        await populateUsers();
        await populateSprints();
        await populateVoyageTeams();
        await populateTablesWithRelations(); //can probably rename this to team resources and project idea
        await populateFormsAndResponses();
        await populateMeetings();
        console.log("===\n🌱 Database seeding completed.\n===");
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
})();
