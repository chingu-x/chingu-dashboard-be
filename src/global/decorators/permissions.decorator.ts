import { SetMetadata } from "@nestjs/common";
import { AppPermissions } from "../../auth/auth.permissions";

export const PERM_KEY = "permissions";

export const Permissions = (...permissions: AppPermissions[]) =>
    SetMetadata(PERM_KEY, permissions);
