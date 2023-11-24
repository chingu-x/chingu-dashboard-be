import * as bcrypt from "bcrypt";

const roundsOfHashing = parseInt(process.env.BCRYPT_HASHING_ROUNDS);

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, roundsOfHashing);
};
