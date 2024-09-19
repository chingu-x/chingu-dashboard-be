export interface AuthConfig {
    secrets: {
        JWT_SECRET: string;
        AT_SECRET: string;
        RT_SECRET: string;
    };
    bcrypt: {
        hashingRounds: number;
    };
}
