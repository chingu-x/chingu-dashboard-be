import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailConfigService {
    constructor(private readonly configService: ConfigService) {}

    getMailjetApiPublic() {
        return this.configService.get<string>("mailjetApiPublic");
    }

    getMailjetApiPrivate() {
        return this.configService.get<string>("mailjetApiPrivate");
    }
}
