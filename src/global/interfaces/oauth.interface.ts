import { DiscordUser, GithubUser, GithubEmail } from "../types/auth.types";

export interface AuthUserResult {
    id: string;
    email: string | GithubEmail | undefined;
}

export interface IAuthProvider {
    validateUser(user: DiscordUser | GithubUser): Promise<AuthUserResult>;
    createUser(user: DiscordUser | GithubUser): Promise<AuthUserResult>;
    findUserByEmails(emails: string[]): Promise<any | null>;
}
