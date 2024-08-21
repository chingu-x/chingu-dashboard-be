import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}
    get nodeEnv() {
        return this.configService.get("app.nodeEnv");
    }

    get appPort() {
        return this.configService.get("app.port");
    }
}
