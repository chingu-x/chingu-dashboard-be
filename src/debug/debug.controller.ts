import { Controller, Get, Param } from "@nestjs/common";
import { DebugService } from "@/debug/debug.service";

@Controller("debug")
export class DebugController {
    constructor(private readonly debugService: DebugService) {}

    @Get("test-onboarding/:email")
    sendOnboardingEmail(@Param("email") email: string) {
        return this.debugService.sendOnboardingEmail(email);
    }
}
