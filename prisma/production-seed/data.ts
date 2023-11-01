import { PrismaClient } from "@prisma/client"

//this file is for adding static values to the production branch
    //package.json file will need to be updated for this.
        //"prisma": {
        //  "seed": ts-node prisma/production-seed.ts
        // }  

const prisma = new PrismaClient();

export const populateStaticValues = async () => {
    
    //FEATURE-CATEGORY
    await prisma.featureCategory.create({
        data: {
            name: 'must have',
            description: 'features that define your MVP'
        }
    });

    await prisma.featureCategory.create({
        data: {
            name: 'should have',
            description: '"stretch goals" to be worked on when you’ve implemented all the "Must Haves"'
        }
    });

    await prisma.featureCategory.create({
        data: {
            name: 'nice to have',
            description: '"stretch goals" to be worked on when you’ve implemented all the "Must Haves" and "Should Haves"'
        }
    });

    //TECH-STACK-CATEGORY
    await prisma.techStackCategory.create({
        data: {
            name: "Frontend",
            description: "Frontend Stuff"
        }
    });

    await prisma.techStackCategory.create({
        data: {
            name: "CSS Library",
            description: "CSS Library"
        }
    });

    await prisma.techStackCategory.create({
        data: {
            name: "Backend",
            description: "Backend Stuff"
        }
    });

    await prisma.techStackCategory.create({
        data: {
            name: "Cloud Provider",
            description: "cloud stuff"
        }
    });

    await prisma.techStackCategory.create({
        data: {
            name: "Hosting",
            description: "Hosting stuff"
        }
    });

}
