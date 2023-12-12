import { OmitType } from "@nestjs/swagger";
import { SignupDto } from "./signup.dto";

export class PasswordResetRequestDto extends OmitType(SignupDto, [
    "password",
] as const) {}
