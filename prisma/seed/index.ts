import {PrismaClient} from "@prisma/client";
import * as process from "process";

const prisma = new PrismaClient()

const Genders = require('./data/genders')
const Tiers = require('./data/tiers')
const VoyageRoles = require('./data/voyage-roles')

const Users = require('./data/users')
const Voyages = require('./data/voyages')

const addTiers = async () => {
    await prisma.tier.deleteMany()
    await prisma.tier.createMany({
        data: Tiers
    })
}

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
const addVoyages = async () => {
    await prisma.voyage.deleteMany()
    await prisma.voyage.createMany({
        data: Voyages
    })
}


(async function () {
    try {
        await populateTable("tier", Tiers)
        await populateTable("gender", Genders)
        await populateTableWithRelations("user", Users)
        await populateTableWithRelations("voyage", Voyages)

        console.log('Database seeding completed.')
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
})()