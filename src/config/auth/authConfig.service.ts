import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface AuthSecrets {
    jwt: string;
    at: string;
    rt: string;
}

interface BcryptConfig {
    hashingRounds: string;
}

interface SocialConfig {
    discord: {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
    };
    // Add other social types here as needed
    // e.g., facebook: {
    //         clientID: string;
    //         clientSecret: string;
    //         callbackURL: string;
    //     };
    //     twitter: {
    //         clientID: string;
    //         clientSecret: string;
    //         callbackURL: string;
    //     };
}

@Injectable()
export class AuthConfigService {
    constructor(private readonly configService: ConfigService) {}

    getSecrets(): AuthSecrets {
        const secrets = this.configService.get<AuthSecrets>("auth.secrets", {
            infer: true,
        });
        if (!secrets) {
            throw new Error("Auth secrets not found in configuration");
        }

        return secrets;
    }

    getBcrypt(): BcryptConfig {
        const bcrypt = this.configService.get<BcryptConfig>("auth.bcrypt", {
            infer: true,
        });
        if (!bcrypt) {
            throw new Error("Bcrypt config not found in configuration");
        }
        return bcrypt;
    }

    getSocial(social: string): SocialConfig | null {
        const socialConfigMap: { [key: string]: string } = {
            discord: "auth.social.discord",
            // Add other social types here as needed
            // e.g., facebook: "auth.social.facebook",
            //       twitter: "auth.social.twitter"
        };

        const configKey = `auth.${socialConfigMap[social]}`;

        if (configKey) {
            return this.configService.get<SocialConfig>(configKey, {
                infer: true,
            });
        }
        console.warn(`Unknown social type: ${social}`);
        return null;
    }
}
