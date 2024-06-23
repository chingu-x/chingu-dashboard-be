import { Controller } from "@nestjs/common";
import { DevelopmentService } from "./development.service";

@Controller("development")
export class DevelopmentController {
    constructor(private readonly developmentService: DevelopmentService) {}
}
