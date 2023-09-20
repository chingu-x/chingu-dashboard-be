const VoyageTeamStatus = require('./voyage-status')


module.exports = [
    {
        voyage:{
            connect: { number: '46'}
        },
        name: "v46-tier2-team-4",
        status:{
            connect: {
                name: VoyageTeamStatus[0].name
            }
        },
        repoUrl: "https://github.com/chingu-voyages/soloproject-tier3-chinguweather",
        repoUrlBE: "https://github.com/chingu-voyages/Handbook",
        deployedUrl: "https://www.chingu.io/",
        deployedUrlBE: "https://stackoverflow.com/questions/4848964/difference-between-text-and-varchar-character-varying",
        tier: {
            connect: { name: "Tier 1"}
        },
        endDate: new Date("2024-11-09")
    },
    {
        voyage:{
            connect: { number: '46'}
        },
        name: "v46-tier3-team-45",
        status:{
            connect: {
                name: VoyageTeamStatus[0].name
            }
        },
        repoUrl: "https://github.com/chingu-voyages/soloproject-tier3-chinguweather",
        tier: {
            connect: { name: "Tier 2"}
        },
        endDate: new Date("2024-11-09")
    }
]