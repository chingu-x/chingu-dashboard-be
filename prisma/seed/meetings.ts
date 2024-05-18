import { getRandomDateDuringSprint, getSprintId } from "./utils";
import { prisma } from "./prisma-client";
import { FormTitles } from "../../src/global/constants/formTitles";

export const populateMeetings = async () => {
    // connect teamMeetings and form id
    const voyageTeams = await prisma.voyageTeam.findMany({});
    const meeting1 = await prisma.teamMeeting.create({
        data: {
            voyageTeamId: voyageTeams[0].id,
            sprintId: await getSprintId(voyageTeams[0].voyageId, 1),
            title: "First sprint kickoff meeting",
            description:
                "Lorem ipsum dolor sit amet consectetur adipiscing elit magna praesent, nunc metus egestas nam libero quisque senectus facilisis, dis nec gravida sodales sagittis duis risus parturient. Eu scelerisque gravida posuere blandit interdum iaculis venenatis rhoncus taciti, tempus nullam cras eros quisque himenaeos condimentum auctor cursus, leo neque montes mollis litora imperdiet luctus purus.",
            dateTime: await getRandomDateDuringSprint(
                await getSprintId(voyageTeams[0].voyageId, 1),
            ),
            meetingLink: "meet.google.com/abcdefg",
            notes: "Title\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis.",
            agendas: {
                create: [
                    {
                        title: "Project Management Tools",
                        description:
                            "Walk the team through how the Jira board is organized and how we will coordinate communications and tickets.",
                        status: false,
                    },
                    {
                        title: "Milestone for this week",
                        description:
                            "FE Team - make homepage responsive\nBE Team - create endpoints for user profile\nDE Team - user flow for the modals",
                        status: false,
                    },
                    {
                        title: "FE Team",
                        description:
                            "Title\nPR pushed this week\n- Modals\n- Components\n- Homepage",
                        status: false,
                    },
                    {
                        title: "BE Team",
                        description:
                            "Title\nEndpoints created this week\n- Homepage\n- User profile\n- Settings",
                        status: false,
                    },
                ],
            },
        },
    });

    //find question Ids from sprint planning form
    const sprintPlanningForm = await prisma.form.findUnique({
        where: {
            title: FormTitles.sprintPlanning,
        },
        select: {
            questions: true,
        },
    });

    await prisma.formResponseMeeting.create({
        data: {
            form: {
                connect: {
                    title: FormTitles.sprintPlanning,
                },
            },
            meeting: {
                connect: {
                    id: meeting1.id,
                },
            },
            responseGroup: {
                create: {
                    responses: {
                        createMany: {
                            data: [
                                {
                                    questionId:
                                        sprintPlanningForm.questions[0].id,
                                    text: "There are a lot of goals we want to achieve",
                                },
                                {
                                    questionId:
                                        sprintPlanningForm.questions[1].id,
                                    text: "Deploy the app",
                                },
                            ],
                        },
                    },
                },
            },
        },
    });

    // this meeting has a Retrospective & Review form connected but it's empty (no response)
    await prisma.formResponseMeeting.create({
        data: {
            form: {
                connect: {
                    title: FormTitles.sprintRetroAndReview,
                },
            },
            meeting: {
                connect: {
                    id: meeting1.id,
                },
            },
            responseGroup: {
                create: {},
            },
        },
    });

    // create meeting 2, 3 with just basic information
    // These two meetings have no forms created/connected
    // meeting 2
    await prisma.teamMeeting.create({
        data: {
            voyageTeamId: voyageTeams[0].id,
            sprintId: await getSprintId(voyageTeams[0].voyageId, 2),
            title: "Second sprint meeting",
            description:
                "Lorem ipsum dolor sit amet consectetur adipiscing elit magna praesent, nunc metus egestas nam libero quisque senectus facilisis, dis nec gravida sodales sagittis duis risus parturient. Eu scelerisque gravida posuere blandit interdum iaculis venenatis rhoncus taciti, tempus nullam cras eros quisque himenaeos condimentum auctor cursus, leo neque montes mollis litora imperdiet luctus purus.",
            dateTime: await getRandomDateDuringSprint(
                await getSprintId(voyageTeams[0].voyageId, 2),
            ),
            meetingLink: "meet.google.com/hijklm",
        },
    });

    // meeting 3
    await prisma.teamMeeting.create({
        data: {
            voyageTeamId: voyageTeams[0].id,
            sprintId: await getSprintId(voyageTeams[0].voyageId, 3),
            title: "Third sprint meeting",
            description:
                "Lorem ipsum dolor sit amet consectetur adipiscing elit magna praesent, nunc metus egestas nam libero quisque senectus facilisis, dis nec gravida sodales sagittis duis risus parturient. Eu scelerisque gravida posuere blandit interdum iaculis venenatis rhoncus taciti, tempus nullam cras eros quisque himenaeos condimentum auctor cursus, leo neque montes mollis litora imperdiet luctus purus.",
            dateTime: await getRandomDateDuringSprint(
                await getSprintId(voyageTeams[0].voyageId, 3),
            ),
            meetingLink: "meet.google.com/opqrst",
            notes: "This is a meeting notes",
        },
    });

    console.log("Meetings populated.");
};
