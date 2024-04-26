import { Subjects } from "@casl/prisma";

import { Form, User, Voyage, VoyageTeam } from "@prisma/client";

export type PrismaSubjects = Subjects<{
    Voyage: Voyage;
    User: User;
    Form: Form;
    VoyageTeam: VoyageTeam;
}>;
