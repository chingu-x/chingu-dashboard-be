import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthConfigService {
    get(key: string): string {
        return process.env[key] ?? "";
    }
    getInt(key: string, defaultValue: string): number {
        return parseInt(process.env[key] ?? defaultValue, 10);
    }
}
