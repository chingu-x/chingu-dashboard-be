export type VoyageTeamMemberWithSprintIds = {
    voyageTeam: {
        voyage: {
            sprints: {
                id: number;
            }[];
        };
    };
};
