import { SetMetadata } from "@nestjs/common";

export const Unverified = () => SetMetadata("isUnverified", true);
