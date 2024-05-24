export const fullUserDetailSelect = {
    id: true,
    email: true,
    emailVerified: true,
    firstName: true,
    lastName: true,
    roles: {
        select: {
            role: {
                select: {
                    name: true,
                },
            },
        },
    },
    avatar: true,
    githubId: true,
    discordId: true,
    twitterId: true,
    linkedinId: true,
    gender: {
        select: {
            id: true,
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
            status: {
                select: {
                    name: true,
                },
            },
            hrPerSprint: true,
        },
    },
};

export const privateUserDetailSelect = {
    id: true,
    firstName: true,
    lastName: true,
    roles: {
        select: {
            role: {
                select: {
                    name: true,
                },
            },
        },
    },
    avatar: true,
    discordId: true,
    githubId: true,
    twitterId: true,
    linkedinId: true,
    email: true,
    countryCode: true,
    timezone: true,
    voyageTeamMembers: {
        select: {
            id: true,
            voyageTeamId: true,
            voyageTeam: {
                select: {
                    name: true,
                    projectSubmitted: false,
                    voyage: {
                        select: {
                            number: true,
                            status: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },
            voyageRole: {
                select: {
                    name: true,
                },
            },
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
