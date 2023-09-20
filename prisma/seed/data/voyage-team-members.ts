export {}
const Users = require('./users')
const VoyageTeams = require('./voyage-teams')
const VoyageRoles = require('./voyage-roles')
const VoyageStatus = require('./voyage-status')

module.exports = [
    {
        member: {
            connect: {
                email: Users[0].email
            }
        },
        voyageTeam:{
            connect: {
                name: VoyageTeams[0].name
            }
        },
        voyageRole:{
            connect: {
                name: VoyageRoles[0].name
            }
        },
        status:{
            connect: {
                name: VoyageStatus[0].name
            }
        },
        hrPerSprint: 10.5
    },
    {
        member: {
            connect: {
                email: Users[1].email
            }
        },
        voyageTeam:{
            connect: {
                name: VoyageTeams[0].name
            }
        },
        voyageRole:{
            connect: {
                name: VoyageRoles[2].name
            }
        },
        status:{
            connect: {
                name: VoyageStatus[0].name
            }
        },
        hrPerSprint: 12.4
    }
]