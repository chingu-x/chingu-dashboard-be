import { Subjects } from "@casl/prisma";

import {
    Form,
    ProjectIdea,
    User,
    Voyage,
    VoyageTeam,
    TeamTechStackItem,
    TeamResource,
} from "@prisma/client";

export type PrismaSubjects = Subjects<{
    Voyage: Voyage;
    User: User;
    Form: Form;
    VoyageTeam: VoyageTeam;
    Ideation: ProjectIdea;
    TeamTechStackItem: TeamTechStackItem;
    Resource: TeamResource;
}>;
