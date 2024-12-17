import { Test, TestingModule } from "@nestjs/testing";
import { EmailService } from "./email.service";
import { MailConfigService } from "@/config/mail/mailConfig.service";
import { AppConfigService } from "@/config/app/appConfig.service";
import { templateIds } from "./templateIds";

jest.mock("node-mailjet", () => ({
    Client: jest.fn().mockImplementation(() => ({
        post: jest.fn(() => ({
            request: jest.fn(),
        })),
    })),
}));

describe("EmailService", () => {
    let emailService: EmailService;

    const mockMailConfigService = {
        MailjetApiPublic: "public-key",
        MailjetApiPrivate: "private-key",
    };
    const mockAppConfigService = {
        nodeEnv: "development",
        FrontendUrl: "https://dashboard-example.com",
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailService,
                { provide: MailConfigService, useValue: mockMailConfigService },
                { provide: AppConfigService, useValue: mockAppConfigService },
            ],
        }).compile();

        emailService = module.get<EmailService>(EmailService);
    });

    it("should be defined", () => {
        expect(emailService).toBeDefined();
    });

    describe("sendSignupVerificationEmail", () => {
        it("should call sendEmail with the correct parameters", async () => {
            const email = "test@example.com";
            const token = "test-token";
            const verificationLink = `${mockAppConfigService.FrontendUrl}/users/verify?token=${token}`;

            const sendEmailSpy = jest.spyOn(emailService as any, "sendEmail");

            await emailService.sendSignupVerificationEmail(email, token);

            expect(sendEmailSpy).toHaveBeenCalledWith(
                email,
                templateIds.verificationEmail,
                { verificationLink },
            );
        });
    });

    describe("sendAttemptedRegistrationEmail", () => {
        it("should call sendEmail with the correct parameters", async () => {
            const email = "test@example.com";
            const passwordResetPage = `${mockAppConfigService.FrontendUrl}/users/reset-password`;

            const sendEmailSpy = jest.spyOn(emailService as any, "sendEmail");

            await emailService.sendAttemptedRegistrationEmail(email);

            expect(sendEmailSpy).toHaveBeenCalledWith(
                email,
                templateIds.attemptRegistrationEmail,
                { userEmail: email, passwordResetPage },
            );
        });
    });

    describe("sendPasswordResetEmail", () => {
        it("should call sendEmail with the correct parameters", async () => {
            const email = "test@example.com";
            const token = "test-token";
            const passwordResetLink = `${mockAppConfigService.FrontendUrl}/users/reset-password?token=${token}`;

            const sendEmailSpy = jest.spyOn(emailService as any, "sendEmail");

            await emailService.sendPasswordResetEmail(email, token);

            expect(sendEmailSpy).toHaveBeenCalledWith(
                email,
                templateIds.passwordResetEmail,
                { passwordResetLink },
            );
        });
    });

    describe("sendEmail", () => {
        it("should not send email in test environment", async () => {
            const email = "test@example.com";
            const templateId = 87966;
            const verificationLink = `${mockAppConfigService.FrontendUrl}/emails`;

            mockAppConfigService.nodeEnv = "test";
            const mockMailjetPost = jest.spyOn(emailService["mailjet"], "post");

            await (emailService as any).sendEmail(
                email,
                templateId,
                verificationLink,
            );

            expect(mockMailjetPost).not.toHaveBeenCalled();
        });
    });
});
