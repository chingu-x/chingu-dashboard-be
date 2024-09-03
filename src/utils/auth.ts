import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

const roundsOfHashing = parseInt(process.env.BCRYPT_HASHING_ROUNDS as string);

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, roundsOfHashing);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// for oauth temp password
export const generatePasswordHash = async (length = 16) => {
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|:;<>,.?/~";

    return hashPassword(
        Array.from(crypto.randomBytes(length))
            .map((byte) => charset[byte % charset.length])
            .join(""),
    );
};
