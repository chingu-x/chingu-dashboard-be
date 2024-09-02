import * as bcrypt from "bcrypt";

const roundsOfHashing = parseInt(process.env.BCRYPT_HASHING_ROUNDS as string);

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, roundsOfHashing);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
