import { templateIds } from "./templateIds";
import * as Mailjet from "node-mailjet";
import * as process from "process";

const mailjet = new Mailjet.Client({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

export const sendSignupVerificationEmail = async (
    email: string,
    token: string,
) => {
    if (process.env.NODE_ENV === "test") return;
    await mailjet.post("send", { version: "v3.1" }).request({
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
                    verificationLink: `${process.env.FRONTEND_URL}/users/verify?token=${token}`,
                },
            },
        ],
    });
};

export const sendAttemptedRegistrationEmail = async (email: string) => {
    if (process.env.NODE_ENV === "test") return;
    await mailjet.post("send", { version: "v3.1" }).request({
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
                    passwordResetPage: `${process.env.FRONTEND_URL}/users/reset-password`,
                },
            },
        ],
    });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    await mailjet.post("send", { version: "v3.1" }).request({
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
                    passwordResetLink: `${process.env.FRONTEND_URL}/users/reset-password?token=${token}`,
                },
            },
        ],
    });
};
