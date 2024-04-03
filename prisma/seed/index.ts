import { seed } from "./seed";

(async function () {
    try {
        await seed();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
