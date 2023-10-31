import {getRandomDateDuringSprint, getSprintId} from "./utils";
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export const populateMeetings = async () => {
// connect teamMeetings and form id
    const voyageTeams = await prisma.voyageTeam.findMany({})
    const meeting1 = await prisma.teamMeeting.create({
        data: {
            voyageTeamId: voyageTeams[0].id,
            sprintId: await getSprintId(voyageTeams[0].voyageId, 1),
            title: "First sprint kickoff meeting",
            dateTime: await getRandomDateDuringSprint(await getSprintId(voyageTeams[0].voyageId, 1)),
            meetingLink: "meet.google.com/abcdefg",
            notes: "Title\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis.",
            agendas: {
                create: [
                    {
                        title: "Project Management Tools",
                        description: "Walk the team through how the Jira board is organized and how we will coordinate communications and tickets.",
                        status: false
                    },
                    {
                        title: "Milestone for this week",
                        description: "FE Team - make homepage responsive\nBE Team - create endpoints for user profile\nDE Team - user flow for the modals",
                        status: false
                    },
                    {
                        title: "FE Team",
                        description: "Title\nPR pushed this week\n- Modals\n- Components\n- Homepage",
                        status: false
                    },
                    {
                        title: "BE Team",
                        description: "Title\nEndpoints created this week\n- Homepage\n- User profile\n- Settings",
                        status: false
                    }
                ]
            },
        }
    })

    const meeting1SprintPlanning = await prisma.formResponseMeeting.create({
        data: {
            form: {
                connect: {
                    title: "Sprint Planning"
                }
            },
            meeting: {
                connect: {
                    id: meeting1.id
                }
            }
        }
    })

    await prisma.teamMeeting.update({
        where: {
            id: meeting1.id
        },
        data: {
            sprintPlanningResponse: {
                connect: {
                    id: meeting1SprintPlanning.id
                }
            }
        }
    })

    const meeting1SprintReview = await prisma.formResponseMeeting.create({
        data: {
            form: {
                connect: {
                    title: "Retrospective & Review"
                }
            },
            meeting: {
                connect: {
                    id: meeting1.id
                }
            }
        }
    })

    await prisma.teamMeeting.update({
        where: {
            id: meeting1.id
        },
        data: {
            sprintReviewResponse: {
                connect: {
                    id: meeting1SprintReview.id
                }
            }
        }
    })

    // create meeting 2, 3 with just basic information
    // meeting 2
    await prisma.teamMeeting.create({
        data: {
            voyageTeamId: voyageTeams[0].id,
            sprintId: await getSprintId(voyageTeams[0].voyageId, 2),
            title: "Second sprint meeting",
            dateTime: await getRandomDateDuringSprint(await getSprintId(voyageTeams[0].voyageId, 2)),
            meetingLink: "meet.google.com/hijklm",
        }
    })

    // meeting 3
    await prisma.teamMeeting.create({
        data: {
            voyageTeamId: voyageTeams[0].id,
            sprintId: await getSprintId(voyageTeams[0].voyageId, 3),
            title: "Third sprint meeting",
            dateTime: await getRandomDateDuringSprint(await getSprintId(voyageTeams[0].voyageId, 3)),
            meetingLink: "meet.google.com/opqrst",
            notes: "This is a meeting notes"
        }
    })

    console.log('Meetings populated.')
}