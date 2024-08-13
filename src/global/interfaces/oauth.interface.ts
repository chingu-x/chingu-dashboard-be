import { DiscordUser } from "../types/auth.types";

export interface IAuthProvider {
    validateUser(user: DiscordUser);
    createUser();
    findUserById();
}
