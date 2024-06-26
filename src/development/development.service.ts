import { HttpStatus, Injectable } from "@nestjs/common";
import { seed } from "../../prisma/seed/seed";

@Injectable()
export class DevelopmentService {
    async reseedDatabase(res) {
        try {
            // TODO: add check to allow this only in development mode
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
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: `Database reseed failed: ${e.message}.`,
            });
        }
    }
}
