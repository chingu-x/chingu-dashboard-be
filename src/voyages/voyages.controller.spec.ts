import { Test, TestingModule } from "@nestjs/testing";
import { VoyagesController } from "./voyages.controller";
import { VoyagesService } from "./voyages.service";
import { CustomRequest } from "../global/types/CustomRequest";
import { CreateVoyageProjectSubmissionDto } from "./dto/create-voyage-project-submission.dto";

describe("VoyagesController", () => {
    let controller: VoyagesController;
    const requestMock = {} as unknown as CustomRequest;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VoyagesController],
            providers: [
                {
                    provide: VoyagesService,
                    useValue: {
                        submitVoyageProject: jest.fn((x) => x),
                    },
                },
            ],
        }).compile();

        controller = module.get<VoyagesController>(VoyagesController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("createVoyageProjectSubmission", () => {
        it("should be defined", () => {
            expect(controller.submitVoyageProject).toBeDefined();
        });

        it("should return 200", async () => {
            const dtoMock = {
                voyageTeamId: 1,
                responses: [
                    { questionId: 26, text: "All" },
                    { questionId: 27, text: "Deploy app" },
                ],
            } as CreateVoyageProjectSubmissionDto;
            await controller.submitVoyageProject(requestMock, dtoMock);
        });
    });
});
