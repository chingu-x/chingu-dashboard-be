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
    email: string | undefined;
};
