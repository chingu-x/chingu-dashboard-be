import TechStackItems from './tech-stack-items'
import VoyageTeams from './voyage-teams'

export default [
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