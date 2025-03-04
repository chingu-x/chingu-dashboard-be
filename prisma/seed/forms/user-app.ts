import { prisma } from "../prisma-client";
import { FormTitles } from "@/global/constants/formTitles";

const getGender = async () => {
    const genders = await prisma.gender.findMany({
        select: {
            abbreviation: true,
            description: true,
        },
    });
    return genders.map((gender) => ({
        ["text"]: `${gender.abbreviation} - ${gender.description}`,
    }));
};

export const populateUserApplicationForm = async () => {
    await prisma.form.create({
        data: {
            formType: {
                connect: {
                    name: "user",
                },
            },
            title: FormTitles.userApplication,
            questions: {
                create: [
                    {
                        pageNumber: 1,
                        order: 1,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "First Name",
                        answerRequired: true,
                    },
                    {
                        pageNumber: 1,
                        order: 2,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "Last Name",
                        answerRequired: true,
                    },
                    {
                        pageNumber: 1,
                        order: 3,
                        inputType: {
                            connect: {
                                name: "dropdown",
                            },
                        },
                        optionGroup: {
                            create: {
                                name: "gender",
                                optionChoices: {
                                    createMany: {
                                        data: await getGender(),
                                    },
                                },
                            },
                        },
                        text: "Last Name",
                        answerRequired: false,
                    },
                    {
                        pageNumber: 1,
                        order: 4,
                        inputType: {
                            connect: {
                                name: "dropdownCountryCode",
                            },
                        },
                        text: "Country Code",
                        answerRequired: true,
                    },
                    {
                        order: 5,
                        inputType: {
                            connect: {
                                name: "no-input-image",
                            },
                        },
                        text: "When something is important enough, you do it even if the odds are not in your favor",
                        parseConfig: {
                            imgUrl: "https://dummyimage.com/600x400/000000/fff.jpg&text=When+something+is+important+enough,+you+do+it+even+if+the+odds+are+not+in+your+favor",
                        },
                        answerRequired: false,
                    },
                    {
                        pageNumber: 2,
                        order: 6,
                        inputType: {
                            connect: {
                                name: "checkbox",
                            },
                        },
                        text: "What Features Are You Most Excited About?",
                        description: "(Maximum 3)",
                        optionGroup: {
                            create: {
                                name: "user-app-features",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "Solidarity",
                                                order: 1,
                                                description:
                                                    "Being in a group of friendly coders who share my goals",
                                            },
                                            {
                                                text: "Teamwork",
                                                order: 2,
                                                description:
                                                    "Having access to team project experiences",
                                            },
                                            {
                                                text: "Support",
                                                order: 3,
                                                description:
                                                    "Help when I get stuck on a coding problem",
                                            },
                                            {
                                                text: "Accountability",
                                                order: 4,
                                                description:
                                                    'Having and "Accountability Buddy" to help me stay motivated',
                                            },
                                            {
                                                text: "Challenge",
                                                order: 5,
                                                description:
                                                    "Getting out of my comfort zone",
                                            },
                                            {
                                                text: "Workshops",
                                                order: 6,
                                                description:
                                                    "Video discussions topics and help sessions",
                                            },
                                            {
                                                text: "Specific Study Groups",
                                                order: 7,
                                                description:
                                                    "Either the #YDKJS or P1xt Guide study-groups",
                                            },
                                            {
                                                text: "Pair Programming",
                                                order: 8,
                                                description:
                                                    "Collaborative problem solving with peers",
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                        answerRequired: true,
                    },
                    {
                        order: 7,
                        inputType: {
                            connect: {
                                name: "no-input-image",
                            },
                        },
                        text: "I think it's possible for ordinary people to choose to be extraordinary",
                        parseConfig: {
                            imgUrl: "https://dummyimage.com/600x400/000000/fff.jpg",
                        },
                        answerRequired: false,
                    },
                    {
                        pageNumber: 3,
                        order: 8,
                        inputType: {
                            connect: {
                                name: "radio",
                            },
                        },
                        text: "How did you hear about us?",
                        optionGroup: {
                            create: {
                                name: "user-app-how-did-you-hear-about-us",
                                optionChoices: {
                                    createMany: {
                                        data: [
                                            {
                                                text: "dev.to",
                                                order: 1,
                                            },
                                            {
                                                text: "The Job Hackers",
                                                order: 2,
                                            },
                                            {
                                                text: "FreeCodeCamp Forum",
                                                order: 3,
                                            },
                                            {
                                                text: "Google Search",
                                                order: 4,
                                            },
                                            {
                                                text: "Medium",
                                                order: 5,
                                            },
                                            {
                                                text: "Personal Network",
                                                order: 6,
                                            },
                                            {
                                                text: "LinkedIn",
                                                order: 7,
                                            },
                                            {
                                                text: "Scrimba",
                                                order: 8,
                                            },
                                            {
                                                text: "X (Formerly Twitter)",
                                                order: 9,
                                            },
                                            {
                                                text: "Youtube",
                                                order: 10,
                                            },
                                            {
                                                text: "Other",
                                                order: 11,
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                        answerRequired: true,
                    },
                    {
                        order: 9,
                        inputType: {
                            connect: {
                                name: "no-input-image",
                            },
                        },
                        text: "I learned to always take on things I'd never done before. Growth and comfort do not coexist",
                        parseConfig: {
                            imgUrl: "https://dummyimage.com/600x400/000000/fff.jpg",
                        },
                        answerRequired: false,
                    },
                    {
                        order: 10,
                        inputType: {
                            connect: {
                                name: "text",
                            },
                        },
                        text: "If you're on LinkedIn, what is your profile URL",
                        answerRequired: false,
                    },
                ],
            },
        },
    });
};
