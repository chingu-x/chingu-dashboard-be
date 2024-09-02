import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthConfigService } from "../config/auth/authConfig.service";
describe("AuthController", () => {
    let controller: AuthController;
    let authConfig: AuthConfigService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {},
                },
                {
                    provide: AuthConfigService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authConfig = module.get<AuthConfigService>(AuthConfigService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
    it("should be defined", () => {
        expect(authConfig).toBeDefined();
    });
});
