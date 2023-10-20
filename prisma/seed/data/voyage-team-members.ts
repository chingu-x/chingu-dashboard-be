import Users from "./users";
import VoyageTeams from "./voyage-teams";
import VoyageRoles from "./voyage-roles";
import VoyageStatus from "./voyage-status";

export default [
    {
        member: {
            connect: {
                email: Users[0].email,
            },
        },
        voyageTeam: {
            connect: {
                name: VoyageTeams[0].name,
            },
        },
        voyageRole: {
            connect: {
                name: VoyageRoles[0].name,
            },
        },
        status: {
            connect: {
                name: VoyageStatus[0].name,
            },
        },
        hrPerSprint: 10.5,
    },
    {
        member: {
            connect: {
                email: Users[1].email,
            },
        },
        voyageTeam: {
            connect: {
                name: VoyageTeams[0].name,
            },
        },
        voyageRole: {
            connect: {
                name: VoyageRoles[2].name,
            },
        },
        status: {
            connect: {
                name: VoyageStatus[0].name,
            },
        },
        hrPerSprint: 12.4,
    },
    {
        member: {
            connect: {
                email: Users[2].email,
            },
        },
        voyageTeam: {
            connect: {
                name: VoyageTeams[0].name,
            },
        },
        voyageRole: {
            connect: {
                name: VoyageRoles[2].name,
            },
        },
        status: {
            connect: {
                name: VoyageStatus[0].name,
            },
        },
        hrPerSprint: 8,
    },
    {
        member: {
            connect: {
                email: Users[3].email,
            },
        },
        voyageTeam: {
            connect: {
                name: VoyageTeams[0].name,
            },
        },
        voyageRole: {
            connect: {
                name: VoyageRoles[2].name,
            },
        },
        status: {
            connect: {
                name: VoyageStatus[0].name,
            },
        },
        hrPerSprint: 20.3,
    }
];