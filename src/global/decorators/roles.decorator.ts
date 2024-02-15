import { AppRoles } from "../../auth/auth.roles";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Roles = (...roles: AppRoles[]) => SetMetadata(ROLES_KEY, roles);
