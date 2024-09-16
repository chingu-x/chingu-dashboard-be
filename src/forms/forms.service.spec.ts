import { Test, TestingModule } from "@nestjs/testing";
import { formSelect, FormsService } from "./forms.service";
import { PrismaService } from "../prisma/prisma.service";
import { prismaMock } from "../prisma/singleton";
import { toBeOneOf, toBeArray } from "jest-extended";
import { CustomRequest } from "../global/types/CustomRequest";

expect.extend({ toBeOneOf, toBeArray });

describe("FormsService", () => {
    let service: FormsService;

    const userReq = {
        userId: "aa9d050e-5756-4c3c-bc04-071f39f53663",
        email: "test@test.com",
        roles: ["admin"],
        isVerified: true,
        voyageTeams: [1],
    };

    const customReq = {
        user: userReq,
    } as any as CustomRequest;

    const mockForms = [
        {
            id: 1,
            formTypeId: 4,
            formType: {
                id: 4,
                name: "meeting",
            },
            title: "Retrospective & Review",
            description: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            questions: [
                {
                    id: 3,
                    order: 1,
                    inputType: {
                        id: 1,
                        name: "text",
                    },
                    text: "What went right?",
                    description: "Share your thoughts on what went right",
                    answerRequired: false,
                    multipleAllowed: null,
                    optionGroup: null,
                    subQuestions: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    order: 2,
                    inputType: {
                        id: 1,
                        name: "text",
                    },
                    text: "What could be improved?",
                    description:
                        "Share your thoughts on what could be improved for the next sprint",
                    answerRequired: false,
                    multipleAllowed: null,
                    optionGroup: null,
                    subQuestions: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 1,
                    order: 3,
                    inputType: {
                        id: 1,
                        name: "text",
                    },
                    text: "Changes to be made for the next sprint?",
                    description:
                        "Share your thoughts on what could be changed for the next sprint",
                    answerRequired: false,
                    multipleAllowed: null,
                    optionGroup: null,
                    subQuestions: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
        },
        {
            id: 2,
            formTypeId: 4,
            formType: {
                id: 4,
                name: "meeting",
            },
            title: "Sprint Planning",
            description: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            questions: [
                {
                    id: 5,
                    order: 1,
                    inputType: {
                        id: 1,
                        name: "text",
                    },
                    text: "Sprint Goal",
                    description: "What is the primary goal of the next sprint?",
                    answerRequired: false,
                    multipleAllowed: null,
                    optionGroup: null,
                    subQuestions: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 4,
                    order: 2,
                    inputType: {
                        id: 1,
                        name: "text",
                    },
                    text: "Timeline/Tasks",
                    description:
                        "What are some of the goals we want to achieve",
                    answerRequired: false,
                    multipleAllowed: null,
                    optionGroup: null,
                    subQuestions: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FormsService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = module.get<FormsService>(FormsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getAllForms", () => {
        it("should return all forms", async () => {
            prismaMock.form.findMany.mockResolvedValue(mockForms);
            const forms = await service.getAllForms();
            expect(forms).toBeArray();
            expect(forms).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        formTypeId: expect.any(Number),
                        formType: expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                        }),
                        title: expect.any(String),
                        description: expect.toBeOneOf([
                            expect.any(String),
                            null,
                        ]),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                        questions: expect.arrayContaining([
                            expect.objectContaining({
                                id: expect.any(Number),
                                order: expect.any(Number),
                                inputType: expect.objectContaining({
                                    id: expect.any(Number),
                                    name: expect.any(String),
                                }),
                                text: expect.any(String),
                                description: expect.any(String),
                                answerRequired: expect.any(Boolean),
                                multipleAllowed: expect.toBeOneOf([
                                    expect.any(Boolean),
                                    null,
                                ]),
                                optionGroup: expect.toBeOneOf([
                                    expect.objectContaining({
                                        optionChoices: expect.objectContaining({
                                            id: expect.any(Number),
                                            text: expect.any(String),
                                        }),
                                    }),
                                    null,
                                ]),
                                subQuestions: expect.toBeArray(),
                                createdAt: expect.any(Date),
                                updatedAt: expect.any(Date),
                            }),
                        ]),
                    }),
                ]),
            );
            expect(prismaMock.form.findMany).toHaveBeenCalledWith({
                select: formSelect,
            });
        });
    });
    describe("getFormById", () => {
        it("should return a form by id", async () => {
            const formId = 1;
            prismaMock.form.findUnique.mockResolvedValue(mockForms[0]);
            const form = await service.getFormById(formId, customReq);
            expect(form).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    formTypeId: expect.any(Number),
                    formType: expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                    }),
                    title: expect.any(String),
                    description: expect.toBeOneOf([expect.any(String), null]),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                    questions: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            order: expect.any(Number),
                            inputType: expect.objectContaining({
                                id: expect.any(Number),
                                name: expect.any(String),
                            }),
                            text: expect.any(String),
                            description: expect.any(String),
                            answerRequired: expect.any(Boolean),
                            multipleAllowed: expect.toBeOneOf([
                                expect.any(Boolean),
                                null,
                            ]),
                            optionGroup: expect.toBeOneOf([
                                expect.objectContaining({
                                    optionChoices: expect.objectContaining({
                                        id: expect.any(Number),
                                        text: expect.any(String),
                                    }),
                                }),
                                null,
                            ]),
                            subQuestions: expect.toBeArray(),
                            createdAt: expect.any(Date),
                            updatedAt: expect.any(Date),
                        }),
                    ]),
                }),
            );
            expect(prismaMock.form.findUnique).toHaveBeenCalledWith({
                where: { id: formId },
                select: formSelect,
            });
        });
    });
});
