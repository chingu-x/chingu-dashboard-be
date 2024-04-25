import { Subjects } from "@casl/prisma";

import { Form, User, Voyage } from "@prisma/client";

export type PrismaSubjects = Subjects<{
    Voyage: Voyage;
    User: User;
    Form: Form;
}>;
