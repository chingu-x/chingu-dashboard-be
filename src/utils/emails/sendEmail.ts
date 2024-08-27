import { Injectable } from "@nestjs/common";
import { templateIds } from "./templateIds";
import * as Mailjet from "node-mailjet";
import { MailConfigService } from "../../config/mail/mailConfig.service";
import { AppConfigService } from "../../config/app/appConfig.service";

@Injectable()
export class EmailService {
    private mailjet: Mailjet.Client;
    constructor(
        private readonly ConfigService: MailConfigService,
        private readonly AppConfigService: AppConfigService,
    ) {
        this.mailjet = new Mailjet.Client({
            apiKey: this.ConfigService.MailjetApiPublic,
            apiSecret: this.ConfigService.MailjetApiPrivate,
        });
    }
    async sendSignupVerificationEmail(email: string, token: string) {
        if (this.AppConfigService.nodeEnv === "test") return;
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
                        verificationLink: `${this.ConfigService.FrontendUrl}/users/verify?token=${token}`,
                    },
                },
            ],
        });
    }

    async sendAttemptedRegistrationEmail(email: string) {
        if (this.AppConfigService.nodeEnv === "test") return;
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
                        passwordResetPage: `${this.ConfigService.FrontendUrl}/users/reset-password`,
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
                        passwordResetLink: `${this.ConfigService.FrontendUrl}/users/reset-password?token=${token}`,
                    },
                },
            ],
        });
    }
}
