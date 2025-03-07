import { EmailService } from "@/utils/emails/email.service";
import { Injectable } from "@nestjs/common";
import * as process from "node:process";

@Injectable()
export class DebugService {
    constructor(private readonly emailService: EmailService) {}
    async sendOnboardingEmail(email: string) {
        console.log(`Sending onboardingEmail to ${email}...`);
        console.log(process.env.MJ_APIKEY_PUBLIC);
        await this.emailService.sendOnboardingChecklistEmail(email);
        return { message: "Email sent! Please check your email" };
    }
}
