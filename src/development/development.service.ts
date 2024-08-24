import {
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    UnprocessableEntityException,
} from "@nestjs/common";
import { seed } from "../../prisma/seed/seed";
import { AppConfigService } from "../config/app/appConfig.service";

@Injectable()
export class DevelopmentService {
    constructor(private readonly appConfigService: AppConfigService) {}
    async reseedDatabase(res) {
        const nodeEnv = this.appConfigService.nodeEnv;

        if (nodeEnv !== "development") {
            throw new UnprocessableEntityException(
                "Reseed failed. This endpoint can only be used in the development environment.",
            );
        }
        try {
            await seed();
            // logs the user out,
            // otherwise there will be errors since logged in user will have a new uuid
            return res
                .status(HttpStatus.OK)
                .clearCookie("access_token")
                .clearCookie("refresh_token")
                .json({
                    message:
                        "Database reseed successful. You are logged out. Please log in again.",
                });
        } catch (e) {
            throw new InternalServerErrorException(
                `Database reseed failed: ${e.message}.`,
            );
        }
    }
}
