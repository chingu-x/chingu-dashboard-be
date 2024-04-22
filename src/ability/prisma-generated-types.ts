import { Subjects } from "@casl/prisma";

import { Voyage } from "@prisma/client";

export type PrismaSubjects = Subjects<{
    Voyage: Voyage;
}>;
