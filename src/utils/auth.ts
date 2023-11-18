import * as bcrypt from "bcrypt";
import process from "process";

const roundsOfHashing = process.env.BCRYPT_HASHING_ROUNDS;

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, roundsOfHashing);
};
