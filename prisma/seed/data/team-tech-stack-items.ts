const TechStackItems = require('./tech-stack-items')
const VoyageTeams = require('./voyage-teams')

module.exports = [
    {
        tech:{
            connect:{
                name: TechStackItems[0].name
            }
        },
        voyageTeam:{
            connect: {
                name: VoyageTeams[0].name
            }
        }
    },
    {
        tech:{
            connect:{
                name: TechStackItems[1].name
            }
        },
        voyageTeam:{
            connect: {
                name: VoyageTeams[0].name
            }
        }
    },
    {
        tech:{
            connect:{
                name: TechStackItems[2].name
            }
        },
        voyageTeam:{
            connect: {
                name: VoyageTeams[0].name
            }
        }
    },
]