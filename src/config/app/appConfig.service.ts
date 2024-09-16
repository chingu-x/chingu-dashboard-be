import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface AppConfig {
    app: {
        nodeEnv: string;
        port: number;
        frontendUrl: string;
    };
}

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService<AppConfig>) {}
    get nodeEnv() {
        return this.configService.get("app.nodeEnv", { infer: true })!;
    }

    get appPort() {
        return this.configService.get("app.port", { infer: true })!;
    }
    get FrontendUrl() {
        return this.configService.get<string>("app.frontendUrl", {
            infer: true,
        })!;
    }
}
