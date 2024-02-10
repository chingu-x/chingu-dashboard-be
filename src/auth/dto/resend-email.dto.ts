import { OmitType } from "@nestjs/swagger";
import { SignupDto } from "./signup.dto";

export class ResendEmailDto extends OmitType(SignupDto, [
    "password",
] as const) {}
