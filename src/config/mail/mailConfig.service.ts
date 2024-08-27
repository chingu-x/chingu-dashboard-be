import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailConfigService {
    constructor(private readonly configService: ConfigService) {}

    get MailjetApiPublic() {
        return this.configService.get<string>("mail.mailjetApiPublic");
    }

    get MailjetApiPrivate() {
        return this.configService.get<string>("mail.mailjetApiPrivate");
    }

    get FrontendUrl() {
        return this.configService.get<string>("mail.frontendUrl");
    }
}
