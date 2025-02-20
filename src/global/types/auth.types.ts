import { Profile } from "passport-github2";

export interface GithubEmail {
    value: string;
    type?: string;
    verified?: boolean;
}

export interface GithubProfile extends Profile {
    emails?: GithubEmail[];
}

export type DiscordUser = {
    discordId: string;
    username: string;
    avatar?: string | null;
    email: string | undefined;
};

export type GithubUser = {
    githubId: string;
    username: string;
    avatar?: string | null;
    email: GithubEmail | undefined;
    verifiedEmails?: string[];
};
