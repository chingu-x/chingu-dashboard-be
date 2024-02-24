import { Controller, Get } from "@nestjs/common";
import { Public } from "../global/decorators/public.decorator";

@Public()
@Controller("health-check")
export class HealthCheckController {
    @Get("/")
    healthCheck() {
        return {
            status: "ok",
            response: "Health Check",
        };
    }
}
