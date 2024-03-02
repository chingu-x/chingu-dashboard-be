import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const populateCheckinFormResponse = async () => {
    const teamMember = await prisma.voyageTeamMember.findUnique({
        where: {
            id: 1,
        },
        select: {
            id: true,
            voyageTeam: {
                select: {
                    voyage: {
                        select: {
                            sprints: true,
                        },
                    },
                },
            },
        },
    });

    const responseGroup = await prisma.responseGroup.create({
        data: {
            responses: {
                createMany: {
                    data: [],
                },
            },
        },
    });
    await prisma.formResponseCheckin.create({
        data: {
            voyageTeamMemberId: teamMember.id,
            sprintId: teamMember.voyageTeam.voyage.sprints[0].id,
            responseGroupId: responseGroup.id,
        },
    });
};
