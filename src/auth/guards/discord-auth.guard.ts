import {
    BadRequestException,
    ExecutionContext,
    Injectable,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class DiscordAuthGuard extends AuthGuard("discord") {
    constructor() {
        super({
            session: false,
        });
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        let activate;
        try {
            activate = (await super.canActivate(context)) as boolean;
        } catch (e) {
            if (e.message.includes("Invalid code")) {
                throw new BadRequestException(
                    `Invalid code in redirect query param.`,
                );
            }
            throw e;
        }
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);

        return activate;
    }
}
