import {PrismaClient} from "@prisma/client";
import * as process from "process";

const prisma = new PrismaClient()

const Genders = require('./data/genders')
const Tiers = require('./data/tiers')
const VoyageRoles = require('./data/voyage-roles')
const VoyageStatus = require('./data/voyage-status')
const TechStackCategories = require('./data/tech-stack-categories')

const Users = require('./data/users')
const Voyages = require('./data/voyages')
const VoyageTeams = require('./data/voyage-teams')
const VoyageTeamMembers = require('./data/voyage-team-members')
const TechStackItems = require('./data/tech-stack-items')

const ProjectIdeas = require('./data/project-ideas')

const populateTable = async (tableName:string, data) => {
    await prisma[tableName].deleteMany()
    await prisma[tableName].createMany({
        data
    })
}

const populateTableWithRelations = async (tableName:string, data) => {
    await prisma[tableName].deleteMany()
    await Promise.all(data.map(row=>prisma[tableName].create({
        data:row
    })))
}

(async function () {
    try {
        await populateTable("tier", Tiers)
        await populateTable("gender", Genders)
        await populateTable("voyageRole", VoyageRoles)
        await populateTable("voyageStatus", VoyageStatus)
        await populateTable("techStackCategory", TechStackCategories)
        await populateTableWithRelations("user", Users)
        await populateTableWithRelations("voyage", Voyages)
        await populateTableWithRelations("voyageTeam", VoyageTeams)
        await populateTableWithRelations("voyageTeamMember", VoyageTeamMembers)
        await populateTableWithRelations("projectIdea", ProjectIdeas)
        await populateTableWithRelations("techStackItem", TechStackItems)

        console.log('Database seeding completed.')
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
})()