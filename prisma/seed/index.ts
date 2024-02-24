import { seed } from "./seed";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
