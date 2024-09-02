import { Subjects } from "@casl/prisma";

import {
    Form,
    ProjectIdea,
    User,
    Voyage,
    VoyageTeam,
    TeamTechStackItem,
    TeamResource,
    ProjectFeature,
    FormResponseCheckin,
} from "@prisma/client";

export type PrismaSubjects = Subjects<{
    Voyage: Voyage;
    User: User;
    Form: Form;
    FormResponseCheckin: FormResponseCheckin;
    VoyageTeam: VoyageTeam;
    Ideation: ProjectIdea;
    TeamTechStackItem: TeamTechStackItem;
    Resource: TeamResource;
    Feature: ProjectFeature;
}>;
