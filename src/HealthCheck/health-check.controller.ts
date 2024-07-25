import { Controller, Get } from "@nestjs/common";
import { Public } from "../global/decorators/public.decorator";
import { ApiTags } from "@nestjs/swagger";

@Public()
@ApiTags("Healthchecks")
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
