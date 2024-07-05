import { SetMetadata } from "@nestjs/common";

export const Unverified = () => SetMetadata("unverifiedRoute", true);
