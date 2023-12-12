import { OmitType } from "@nestjs/swagger";
import { SignupDto } from "./signup.dto";

export class ResetPasswordRequestDto extends OmitType(SignupDto, [
    "password",
] as const) {}
