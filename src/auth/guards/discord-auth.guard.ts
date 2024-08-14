import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class DiscordAuthGuard extends AuthGuard("discord") {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const activate = (await super.canActivate(context)) as boolean;
        console.log(`discord-auth.guard.ts (8): activate = ${activate}`);
        const request = context.switchToHttp().getRequest();
        console.log(`discord-auth.guard.ts (10): request = ${request}`);
        await super.logIn(request);
        return activate;
    }
}
