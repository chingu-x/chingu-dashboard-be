import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthConfigService {
    constructor(private readonly configService: ConfigService) {}

    getSecrets() {
        return this.configService.get("auth.secrets");
    }

    getBcrypt() {
        return this.configService.get("auth.bcrypt");
    }

    getSocial() {
        return this.configService.get("auth.social");
    }
}
