import { DiscordUser } from "../types/auth.types";

export interface IAuthProvider {
    // TODO: Maybe change it to OAuthUser: DiscordUser | GithubUser
    validateUser(user: DiscordUser): void;
    createUser(user: DiscordUser): void;
}
