import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: "email",
        });
    }

    async validate(email: string, password: string): Promise<any> {
        if (!email || !password) {
            throw new BadRequestException("Missing username or password");
        }
        const user = await this.authService.validateUser(email, password);
        // nestjs automatically returns "unauthorized" if user is null
        return user;
    }
}
