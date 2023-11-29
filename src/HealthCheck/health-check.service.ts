import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { HealthCheckDto } from "./health-check.dto";

@Injectable()
export class HealthCheckService {
    constructor(private readonly prisma: PrismaService) {}

    async createHealthCheck(data: HealthCheckDto): Promise<any> {
        return this.prisma.healthCheck.create({
            data,
        });
    }
}
