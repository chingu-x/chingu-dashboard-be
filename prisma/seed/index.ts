import {PrismaClient} from "@prisma/client";
import * as process from "process";

const prisma = new PrismaClient()

const Users = require('./data/users')

const addUsers = async() => {
    try {
        await prisma.user.deleteMany()
        await Promise.all(
            Users.map(async (user) =>
                prisma.user.create({
                    data: user
                })
            )
        )
        console.log('Database seeding completed.')
    }
    catch (e){
        console.log(`Error seeding database: ${e}`)
    }
}
const addVoyages = async() => {

}

async function main() {
    await addUsers()
    await addVoyages()
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });