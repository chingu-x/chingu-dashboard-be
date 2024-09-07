export interface OAuthConfig {
    discord: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
    // Add other OAuth providers as needed
}
