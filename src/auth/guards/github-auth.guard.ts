import {
    BadRequestException,
    ExecutionContext,
    Injectable,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GithubAuthGuard extends AuthGuard("github") {
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
            if (e.message.includes("Failed to obtain access token")) {
                throw new BadRequestException(
                    `Failed to obtain access token. Possibly because of invalid redirect code.`,
                );
            }
            throw e;
        }
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);

        return activate;
    }
}
