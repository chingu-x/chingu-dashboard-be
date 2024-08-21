import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DbConfigService {
    constructor(private readonly configService: ConfigService) {}

    get dbUrl() {
        return this.configService.get("database.dbUrl");
    }
}
