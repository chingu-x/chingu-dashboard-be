import { populateTables } from "../seed/tables";
import { prisma } from "../seed/prisma-client";

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

    console.log("===\n🌱 [Production] Database seeding completed.\n===");

    prisma.$disconnect();
})();
