import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}
    private readonly logger = new Logger(TasksService.name);

    // run on the 1st and 15th days of the month
    @Cron("0 0 1,15 * *")
    async handleCron() {
        // delete tokens two weeks or more old
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        this.logger.debug("Running cron job to delete old tokens...");

        try {
            await this.prisma.emailVerificationToken.deleteMany({
                where: {
                    createdAt: {
                        lte: twoWeeksAgo,
                    },
                },
            });

            await this.prisma.resetToken.deleteMany({
                where: {
                    createdAt: {
                        lte: twoWeeksAgo,
                    },
                },
            });
        } catch (e) {
            this.logger.error(e);
        }
    }
}
