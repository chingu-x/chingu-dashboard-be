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
    let sendEmailSpy: jest.SpyInstance;
    const mockMailConfigService = {
        MailjetApiPublic: "some-public-key",
        MailjetApiPrivate: "some-private-key",
    };
    const mockAppConfigService = {
        nodeEnv: "development",
        FrontendUrl: "https://dashboard-example.com",
    };

    const createTestData = () => ({
        email: "test@chingu.com",
        token: "test-token",
        templateId: 56789,
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailService,
                { provide: MailConfigService, useValue: mockMailConfigService },
                { provide: AppConfigService, useValue: mockAppConfigService },
            ],
        }).compile();

        emailService = module.get<EmailService>(EmailService);
        sendEmailSpy = jest.spyOn(emailService as any, "sendEmail");
    });

    it("should be defined", () => {
        expect(emailService).toBeDefined();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("sendSignupVerificationEmail", () => {
        it("should call sendEmail with the correct parameters", async () => {
            const { email, token } = createTestData();

            const verificationLink = `${mockAppConfigService.FrontendUrl}/users/verify?token=${token}`;

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
            const { email } = createTestData();
            const passwordResetPage = `${mockAppConfigService.FrontendUrl}/users/reset-password`;

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
            const { email, token } = createTestData();
            const passwordResetLink = `${mockAppConfigService.FrontendUrl}/users/reset-password?token=${token}`;

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
            const { email, templateId } = createTestData();
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
