// Note: dev (deployed) and prod use the same MJ account and templates (chingu Mailjet)
const templateIdsSets = {
    local: {
        verificationEmail: 6788633,
        attemptRegistrationEmail: 6790023,
        passwordResetEmail: 6790028,
        onboardingEmail: 6789100,
    },
    dev: {
        verificationEmail: 5340132,
        attemptRegistrationEmail: 5403086,
        passwordResetEmail: 5406931,
        onboardingEmail: 6711859,
    },
};

const MJ_ENV = process.env.MJ_ENV === "local" ? "local" : "dev";
export const templateIds = templateIdsSets[MJ_ENV];
