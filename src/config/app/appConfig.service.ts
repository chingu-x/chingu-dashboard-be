import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFileSync } from "fs";
import { join } from "path";

interface AppConfig {
    app: {
        nodeEnv: string;
        port: number;
        frontendUrl: string;
        latestReleaseVersion: string;
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

    get latestReleaseVersion() {
        //retrieve the latest version from package.json
        const packageJsonPath = join(__dirname, "../../../../", "package.json");
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        return packageJson.version;
    }
}
