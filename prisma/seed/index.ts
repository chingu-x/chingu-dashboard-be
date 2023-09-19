import {PrismaClient} from "@prisma/client";
import * as process from "process";
import {populateTablesWithRelations} from "./relations";

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
const TeamTechStackItems = require('./data/team-tech-stack-items')

const deleteAllTables = async () => {
    const tablenames = await prisma.$queryRaw<
        Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

    const tables = tablenames
        .map(({ tablename }) => tablename)
        .filter((name) => name !== '_prisma_migrations')
        .map((name) => `"public"."${name}"`)
        .join(', ')

    try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
    } catch (error) {
        console.log({ error })
    }
    console.log('===\nAll tables deleted.\n===')
}

const populateTable = async (tableName: string, data) => {
    await Promise.all(data.map(row => prisma[tableName].create({
        data: row
    })))
    console.log(`${tableName} table populated.`)
}

(async function () {
    try {
        await deleteAllTables()
        await populateTable("tier", Tiers)
        await populateTable("gender", Genders)
        await populateTable("voyageRole", VoyageRoles)
        await populateTable("voyageStatus", VoyageStatus)
        await populateTable("techStackCategory", TechStackCategories)
        await populateTable("user", Users)
        await populateTable("voyage", Voyages)
        await populateTable("voyageTeam", VoyageTeams)
        await populateTable("voyageTeamMember", VoyageTeamMembers)
        await populateTable("techStackItem", TechStackItems)
        await populateTable("teamTechStackItem", TeamTechStackItems)

        await populateTablesWithRelations()

        console.log('===\nDatabase seeding completed.\n===')
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
})()