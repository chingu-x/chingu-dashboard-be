import { Injectable } from "@nestjs/common";
import { AbilityBuilder, PureAbility } from "@casl/ability";
import { PrismaSubjects } from "../prisma-generated-types";
import { createPrismaAbility, PrismaQuery } from "@casl/prisma";
import { CustomRequest } from "../../global/types/CustomRequest";

export enum Action {
    Manage = "manage",
    Create = "create",
    Read = "read",
    Update = "update",
    Delete = "delete",
}

type ExtendedSubjects = "all";
export type AppSubjects = PrismaSubjects | ExtendedSubjects;
export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

@Injectable()
export class AbilityFactory {
    defineAbility({ user }: CustomRequest) {
        const { can, build } = new AbilityBuilder<AppAbility>(
            createPrismaAbility,
        );

        if (user.roles.includes("admin")) {
            can(Action.Manage, "User");
        } else {
            can(Action.Read, "User");
        }
        return build();
    }
}
