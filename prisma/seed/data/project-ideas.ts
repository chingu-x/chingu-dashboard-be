export {}

const VoyageTeamMembers = require('./voyage-team-members')
const VoyageTeams = require('./voyage-teams')


module.exports = [
    {
        contributedBy: {
            connect: {
                member:VoyageTeamMembers[0]
            }
        },
        voyageTeam:{
            connect: {
                name: VoyageTeams[0].name
            }
        },
        title: "Project Idea 1",
        description: "Project idea description 1",
        vision: "Project idea vision",
    }
]