import { DiscordUser } from "../types/auth.types";
import { GithubUser } from "../types/auth.types";

export interface AuthUserResult {
    id: string;
    email: string | undefined;
}

export interface IAuthProvider {
    validateUser(user: DiscordUser | GithubUser): Promise<AuthUserResult>;
    createUser(user: DiscordUser | GithubUser): Promise<AuthUserResult>;
}
