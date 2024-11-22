import { Test, TestingModule } from "@nestjs/testing";
import { TechsController } from "./techs.controller";
import { TechsService } from "./techs.service";
//import { CustomRequest } from "@/global/types/CustomRequest";

describe("TechsController", () => {
    let controller: TechsController;

    const mockTechsService = {
        getAllTechItemsByTeamId: jest.fn(() => {}),
        addNewTeamTech: jest.fn(() => {}),
        updateTeamTech: jest.fn(() => {}),
        deleteTeamTech: jest.fn(() => {}),
        addNewTechStackCategory: jest.fn(() => {}),
        updateTechStackCategory: jest.fn(() => {}),
        deleteTechStackCategory: jest.fn(() => {}),
        addExistingTechVote: jest.fn(() => {}),
        removeVote: jest.fn(() => {}),
        updateTechStackSelections: jest.fn(() => {}),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TechsController],
            providers: [TechsService],
        })
            .overrideProvider(TechsService)
            .useValue(mockTechsService)
            .compile();

        controller = module.get<TechsController>(TechsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getAllTechItemsByTeamId", () => {
        it("should be defined", () => {
            expect(controller.getAllTechItemsByTeamId).toBeDefined();
        });
    });

    describe("addNewTeamTech", () => {
        it("should be defined", () => {
            expect(controller.addNewTeamTech).toBeDefined();
        });
    });

    describe("updateTeamTech", () => {
        it("should be defined", () => {
            expect(controller.updateTeamTech).toBeDefined();
        });
    });

    describe("deleteTeamTech", () => {
        it("should be defined", () => {
            expect(controller.deleteTeamTech).toBeDefined();
        });
    });

    describe("addNewTechStackCategory", () => {
        it("should be defined", () => {
            expect(controller.addNewTechStackCategory).toBeDefined();
        });
    });

    describe("updateTechStackCategory", () => {
        it("should be defined", () => {
            expect(controller.updateTechStackCategory).toBeDefined();
        });
    });

    describe("deleteTechStackCategory", () => {
        it("should be defined", () => {
            expect(controller.deleteTechStackCategory).toBeDefined();
        });
    });

    describe("addExistingTechVote", () => {
        it("should be defined", () => {
            expect(controller.addExistingTechVote).toBeDefined();
        });
    });

    describe("removeVote", () => {
        it("should be defined", () => {
            expect(controller.removeVote).toBeDefined();
        });
    });

    describe("updateTechStackSelections", () => {
        it("should be defined", () => {
            expect(controller.updateTechStackSelections).toBeDefined();
        });
    });
});
