import { fullUserDetailSelect, publicUserDetailSelect } from "./users.select";

export const publicVoyageTeamUserSelect = {
    id: true,
    voyageId: true,
    name: true,
    status: {
        select: {
            name: true,
        },
    },
    repoUrl: true,
    repoUrlBE: true,
    deployedUrl: true,
    deployedUrlBE: true,
    tier: {
        select: {
            id: true,
            name: true,
        },
    },
    endDate: true,
    voyageTeamMembers: {
        select: {
            id: true,
            member: {
                select: publicUserDetailSelect,
            },
            hrPerSprint: true,
            voyageRole: {
                select: {
                    name: true,
                },
            },
        },
    },
};

export const fullVoyageTeamUserSelect = {
    id: true,
    voyageId: true,
    name: true,
    status: {
        select: {
            name: true,
        },
    },
    repoUrl: true,
    repoUrlBE: true,
    deployedUrl: true,
    deployedUrlBE: true,
    tier: {
        select: {
            id: true,
            name: true,
        },
    },
    endDate: true,
    voyageTeamMembers: {
        select: {
            member: {
                select: fullUserDetailSelect,
            },
        },
    },
};
