import { Subjects } from "@casl/prisma";

import {
    Form,
    Prisma,
    ProjectIdea,
    User,
    Voyage,
    VoyageTeam,
} from "@prisma/client";

export type PrismaSubjects = Subjects<{
    Voyage: Voyage;
    User: User;
    Form: Form;
    VoyageTeam: VoyageTeam;
    Ideation: ProjectIdea;
}>;
