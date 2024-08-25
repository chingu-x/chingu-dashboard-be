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
    oAuthProfiles: {
        select: {
            provider: {
                select: {
                    name: true,
                },
            },
            providerUsername: true,
        },
    },
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
    oAuthProfiles: {
        select: {
            provider: {
                select: {
                    name: true,
                },
            },
            providerUsername: true,
        },
    },
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
                    FormResponseVoyageProject: true,
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
    oAuthProfiles: {
        select: {
            provider: {
                select: {
                    name: true,
                },
            },
            providerUsername: true,
        },
    },
    countryCode: true,
    timezone: true,
};
