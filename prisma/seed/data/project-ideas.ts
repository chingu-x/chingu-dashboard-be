export {}

const Users = require('./users')
const VoyageTeams = require('./voyage-teams')


module.exports = [
    {
        contributedBy: {
            connect: {
                email: Users[0].email
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