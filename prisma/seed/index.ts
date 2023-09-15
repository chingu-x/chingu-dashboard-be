import {PrismaClient} from "@prisma/client";
import * as process from "process";

const prisma = new PrismaClient()

const Genders = require('./data/genders')
const Tiers = require('./data/tiers')

const Users = require('./data/users')
const Voyages = require('./data/voyages')

const addTiers = async () => {
    await prisma.tier.deleteMany()
    await prisma.tier.createMany({
        data: Tiers
    })
}

const addGenders = async () => {
    await prisma.gender.deleteMany()
    await prisma.gender.createMany({
        data: Genders
    })
}

const addUsers = async () => {
    await prisma.user.deleteMany()
    await Promise.all(Users.map(user=>prisma.user.create({
        data:user
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
        await addTiers()
        await addGenders()
        await addUsers()
        await addVoyages()

        console.log('Database seeding completed.')
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
})()