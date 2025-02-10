import { Controller, Get, Param } from "@nestjs/common";
import { DebugService } from "@/debug/debug.service";
import { ApiOperation } from "@nestjs/swagger";

@Controller("debug")
export class DebugController {
    constructor(private readonly debugService: DebugService) {}

    @ApiOperation({
        summary: "Send onboardingEmail",
    })
    @Get("test-onboarding/:email")
    sendOnboardingEmail(@Param("email") email: string) {
        return this.debugService.sendOnboardingEmail(email);
    }
}
