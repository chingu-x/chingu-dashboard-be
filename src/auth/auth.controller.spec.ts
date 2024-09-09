import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AppConfigService } from "@/config/app/appConfig.service";
import { MailConfigService } from "../config/mail/mailConfig.service";
describe("AuthController", () => {
    let controller: AuthController;
    let authService: AuthService;
    let appConfigService: AppConfigService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {},
                },
                {
                    provide: "Auth-Config",
                    useValue: {},
                },
                {
                    provide: MailConfigService,
                    useValue: {},
                },
                {
                    provide: AppConfigService,

                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        appConfigService = module.get<AppConfigService>(AppConfigService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
    it("should be defined", () => {
        expect(authService).toBeDefined();
    });

    it("should be defined", () => {
        expect(appConfigService).toBeDefined();
    });
});
