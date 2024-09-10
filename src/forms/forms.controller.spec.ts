import { Test, TestingModule } from "@nestjs/testing";
import { FormsController } from "./forms.controller";
import { FormsService } from "./forms.service";

describe("FormsController", () => {
    let controller: FormsController;

    const mockFormsService = {
        getAllForms: jest.fn(),
        getFormById: jest.fn(),
    };

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
            controllers: [FormsController],
            providers: [FormsService],
        })
            .overrideProvider(FormsService)
            .useValue(mockFormsService)
            .compile();

        controller = module.get<FormsController>(FormsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getAllForms", () => {
        it("should be defined", () => {
            expect(controller.getAllForms).toBeDefined();
        });

        it("should return all forms", async () => {
            mockFormsService.getAllForms.mockResolvedValueOnce(mockForms);

            const forms = await controller.getAllForms();
            expect(forms).toEqual(mockForms);
            expect(mockFormsService.getAllForms).toHaveBeenCalled();
        });
    });
});
