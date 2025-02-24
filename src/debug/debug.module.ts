import { Module } from "@nestjs/common";
import { DebugController } from "@/debug/debug.controller";
import { DebugService } from "@/debug/debug.service";
import { MailConfigModule } from "@/config/mail/mailConfig.module";
import { EmailService } from "@/utils/emails/email.service";

@Module({
    imports: [MailConfigModule],
    controllers: [DebugController],
    providers: [DebugService, EmailService],
})
export class DebugModule {}
