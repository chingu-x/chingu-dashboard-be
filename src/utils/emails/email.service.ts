import { Injectable } from "@nestjs/common";
import { templateIds } from "./templateIds";
import * as Mailjet from "node-mailjet";
import { MailConfigService } from "@/config/mail/mailConfig.service";
import { AppConfigService } from "@/config/app/appConfig.service";

@Injectable()
export class EmailService {
    private mailjet: Mailjet.Client;
    constructor(
        private readonly mailConfigService: MailConfigService,
        private readonly appConfigService: AppConfigService,
    ) {
        this.mailjet = new Mailjet.Client({
            apiKey: this.mailConfigService.MailjetApiPublic,
            apiSecret: this.mailConfigService.MailjetApiPrivate,
        });
    }

    private async sendEmail(email: string, templateId: number, variables: {}) {
        if (this.appConfigService.nodeEnv === "test") return;
        await this.mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    To: [{ Email: email }],
                    TemplateID: templateId,
                    TemplateLanguage: true,
                    Variables: variables,
                },
            ],
        });
    }
    async sendSignupVerificationEmail(email: string, token: string) {
        const verificationLink = `${this.appConfigService.FrontendUrl}/users/verify?token=${token}`;
        await this.sendEmail(email, templateIds.verificationEmail, {
            verificationLink,
        });
    }

    async sendAttemptedRegistrationEmail(email: string) {
        const passwordResetPage = `${this.appConfigService.FrontendUrl}/users/reset-password`;
        await this.sendEmail(email, templateIds.attemptRegistrationEmail, {
            userEmail: email,
            passwordResetPage,
        });
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const passwordResetLink = `${this.appConfigService.FrontendUrl}/users/reset-password?token=${token}`;
        await this.sendEmail(email, templateIds.passwordResetEmail, {
            passwordResetLink,
        });
    }
}
