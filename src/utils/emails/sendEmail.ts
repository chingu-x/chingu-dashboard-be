import { Injectable } from "@nestjs/common";
import { templateIds } from "./templateIds";
import * as Mailjet from "node-mailjet";
import { MailConfigService } from "../../config/mail/mailConfig.service";
import { AppConfigService } from "../../config/app/appConfig.service";

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
    async sendSignupVerificationEmail(email: string, token: string) {
        if (this.appConfigService.nodeEnv === "test") return;
        await this.mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    To: [
                        {
                            Email: email,
                        },
                    ],
                    TemplateID: templateIds.verificationEmail,
                    TemplateLanguage: true,
                    Variables: {
                        verificationLink: `${this.mailConfigService.FrontendUrl}/users/verify?token=${token}`,
                    },
                },
            ],
        });
    }

    async sendAttemptedRegistrationEmail(email: string) {
        if (this.appConfigService.nodeEnv === "test") return;
        await this.mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    To: [
                        {
                            Email: email,
                        },
                    ],
                    TemplateID: templateIds.attemptRegistrationEmail,
                    TemplateLanguage: true,
                    Variables: {
                        userEmail: email,
                        passwordResetPage: `${this.mailConfigService.FrontendUrl}/users/reset-password`,
                    },
                },
            ],
        });
    }

    async sendPasswordResetEmail(email: string, token: string) {
        await this.mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    To: [
                        {
                            Email: email,
                        },
                    ],
                    TemplateID: templateIds.passwordResetEmail,
                    TemplateLanguage: true,
                    Variables: {
                        passwordResetLink: `${this.mailConfigService.FrontendUrl}/users/reset-password?token=${token}`,
                    },
                },
            ],
        });
    }
}
