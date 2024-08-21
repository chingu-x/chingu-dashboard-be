import { DiscordUser } from "../types/auth.types";

export interface IAuthProvider {
    // TODO: Maybe change it to OAuthUser: DiscordUser | GithubUser etc
    //   Or change it to a more general type name
    validateUser(user: DiscordUser): void;
    createUser(user: DiscordUser): void;
}
