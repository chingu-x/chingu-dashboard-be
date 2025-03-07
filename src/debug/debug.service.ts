import { EmailService } from "@/utils/emails/email.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DebugService {
    constructor(private readonly emailService: EmailService) {}
    async sendOnboardingEmail(email: string) {
        console.log(`Sending onboardingEmail to ${email}...`);
        await this.emailService.sendOnboardingChecklistEmail(email);
        return { message: "Email sent! Please check your email" };
    }
}
