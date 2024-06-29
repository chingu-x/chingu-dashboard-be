import {
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    UnprocessableEntityException,
} from "@nestjs/common";
import { seed } from "../../prisma/seed/seed";
import * as process from "node:process";

@Injectable()
export class DevelopmentService {
    async reseedDatabase(res) {
        if (process.env.NODE_ENV !== "development") {
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
