import * as bcrypt from "bcrypt";
import { AuthConfigService } from "src/config/auth/authConfig.service";

const roundsOfHashing = parseInt(process.env.BCRYPT_HASHING_ROUNDS as string);

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, roundsOfHashing);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
