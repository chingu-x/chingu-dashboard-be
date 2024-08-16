import { populateTables } from "../seed/tables";
import { prisma } from "../seed/prisma-client";
import { populateVoyagesProd } from "./voyages";
import { populateSprints } from "../seed/sprints";
import { populateUsersProd } from "./users";

export const deleteAllTables = async () => {
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
    console.log("===\n[Production] All tables deleted.\n===");
};

(async function () {
    await deleteAllTables();
    await populateTables(); // tables with no relations
    await populateVoyagesProd();
    await populateSprints();

    await populateUsersProd();

    console.log("===\n🌱 [Production] Database seeding completed.\n===");

    prisma.$disconnect();
})();
