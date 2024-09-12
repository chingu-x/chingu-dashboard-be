import { Test, TestingModule } from "@nestjs/testing";
import { formSelect, FormsService } from "./forms.service";
import { PrismaService } from "../prisma/prisma.service";
import { prismaMock } from "../prisma/singleton";

describe("FormsService", () => {
    let service: FormsService;

    const mockForms = [
        {
            id: 1,
            formType: {
                id: 4,
                name: "meeting",
            },
            title: "Retrospective & Review",
            description: null,
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
                    createdAt: "2024-09-10T07:35:38.886Z",
                    updatedAt: "2024-09-10T07:35:38.886Z",
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
                    createdAt: "2024-09-10T07:35:38.886Z",
                    updatedAt: "2024-09-10T07:35:38.886Z",
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
                    createdAt: "2024-09-10T07:35:38.886Z",
                    updatedAt: "2024-09-10T07:35:38.886Z",
                },
            ],
        },
        {
            id: 2,
            formType: {
                id: 4,
                name: "meeting",
            },
            title: "Sprint Planning",
            description: null,
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
                    createdAt: "2024-09-10T07:35:38.907Z",
                    updatedAt: "2024-09-10T07:35:38.907Z",
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
                    createdAt: "2024-09-10T07:35:38.907Z",
                    updatedAt: "2024-09-10T07:35:38.907Z",
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
            prismaMock.form.findMany.mockResolvedValue(mockForms as any);
            const forms = await service.getAllForms();
            expect(forms).toBeArray;
            expect(prismaMock.form.findMany).toHaveBeenCalledWith({
                select: formSelect,
            });
        });
    });
});
