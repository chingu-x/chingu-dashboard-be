import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { GlobalService } from "../global/global.service";
import { UsersService } from "../users/users.service";
import { AppConfigService } from "../config/app/appConfig.service";
import { EmailService } from "../utils/emails/email.service";
import { AuthConfig } from "../config/auth/auth.interface";

describe("AuthService", () => {
    let service: AuthService;
    let config: AppConfigService;
    let emailService: EmailService;
    let authConfig: AuthConfig;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AppConfigService,
                    useValue: {
                        nodeEnv: jest.fn((key: string) =>
                            key === "NODE_ENV" ? "development" : undefined,
                        ),
                    },
                },
                {
                    provide: "Auth-Config",
                    useValue: {
                        secrets: {
                            JWT_SECRET: "jwt-secret",
                            AT_SECRET: "at-secret",
                            RT_SECRET: "rt-secret",
                        },
                        bcrypt: {
                            hashingRounds: 10,
                        },
                    } as AuthConfig,
                },
                {
                    provide: EmailService,
                    useValue: {
                        sendEmail: jest.fn(),
                    },
                },
                AuthService,
                {
                    provide: PrismaService,
                    useValue: {},
                },
                GlobalService,
                UsersService,
                JwtService,
            ],
        }).compile();
        config = module.get<AppConfigService>(AppConfigService);

        emailService = module.get<EmailService>(EmailService);
        service = module.get<AuthService>(AuthService);
        authConfig = module.get("Auth-Config");
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    it("should be defiined", () => {
        expect(config).toBeDefined();
    });
    it("should be defiined", () => {
        expect(emailService).toBeDefined();
    });
    it("should have Auth_Config injected", () => {
        expect(authConfig).toBeDefined();
        expect(authConfig.secrets).toBeDefined();
        expect(authConfig.secrets.JWT_SECRET).toBeDefined();
        expect(authConfig.secrets.AT_SECRET).toBeDefined();
        expect(authConfig.secrets.RT_SECRET).toBeDefined();
        expect(authConfig.bcrypt).toBeDefined();
        expect(authConfig.bcrypt.hashingRounds).toBeDefined();
    });
});
