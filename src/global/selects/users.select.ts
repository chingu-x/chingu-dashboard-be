export const fullUserDetailSelect = {
    id: true,
    firstName: true,
    lastName: true,
    avatar: true,
    githubId: true,
    discordId: true,
    twitterId: true,
    linkedinId: true,
    email: true,
    gender: {
        select: {
            abbreviation: true,
            description: true,
        },
    },
    countryCode: true,
    timezone: true,
    comment: true,
    voyageTeamMembers: {
        select: {
            id: true,
            voyageTeam: {
                select: {
                    id: true,
                    name: true,
                    tier: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
            voyageRole: {
                select: {
                    name: true,
                },
            },
            status: true,
            hrPerSprint: true,
        },
    },
};

export const publicUserDetailSelect = {
    firstName: true,
    lastName: true,
    avatar: true,
    githubId: true,
    discordId: true,
    twitterId: true,
    linkedinId: true,
    countryCode: true,
    timezone: true,
};
